package com.naengpa.app.ui.screens.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.naengpa.app.data.RegisterRequest
import com.naengpa.app.data.TokenStore
import com.naengpa.app.network.NetworkModule
import com.naengpa.app.network.parseErrorMessage
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import retrofit2.HttpException

enum class HouseholdMode { CREATE, JOIN }

data class SignupSuccess(val householdName: String, val inviteCode: String, val mode: HouseholdMode)

data class SignupUiState(
    val loading: Boolean = false,
    val error: String? = null,
    val success: SignupSuccess? = null
)

class SignupViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(SignupUiState())
    val uiState: StateFlow<SignupUiState> = _uiState.asStateFlow()

    fun register(
        name: String,
        email: String,
        password: String,
        mode: HouseholdMode,
        householdName: String,
        inviteCode: String
    ) {
        _uiState.value = SignupUiState(loading = true)
        viewModelScope.launch {
            try {
                val response = NetworkModule.api.register(
                    RegisterRequest(
                        email = email.trim(),
                        password = password,
                        name = name.trim(),
                        householdName = if (mode == HouseholdMode.CREATE) householdName.trim() else null,
                        inviteCode = if (mode == HouseholdMode.JOIN) inviteCode.trim().uppercase() else null
                    )
                )
                TokenStore.token = response.token
                _uiState.value = SignupUiState(
                    success = SignupSuccess(response.user.householdName, response.user.inviteCode, mode)
                )
            } catch (e: HttpException) {
                _uiState.value = SignupUiState(error = parseErrorMessage(e) ?: "회원가입에 실패했어요.")
            } catch (e: Exception) {
                _uiState.value = SignupUiState(error = e.message ?: "회원가입 중 오류가 발생했어요.")
            }
        }
    }
}
