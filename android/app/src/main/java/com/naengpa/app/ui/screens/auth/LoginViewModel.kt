package com.naengpa.app.ui.screens.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.naengpa.app.data.LoginRequest
import com.naengpa.app.data.TokenStore
import com.naengpa.app.network.NetworkModule
import com.naengpa.app.network.parseErrorMessage
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import retrofit2.HttpException

data class LoginUiState(
    val loading: Boolean = false,
    val error: String? = null,
    val loggedIn: Boolean = false
)

class LoginViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun login(email: String, password: String) {
        _uiState.value = LoginUiState(loading = true)
        viewModelScope.launch {
            try {
                val response = NetworkModule.api.login(LoginRequest(email.trim(), password))
                TokenStore.token = response.token
                _uiState.value = LoginUiState(loggedIn = true)
            } catch (e: HttpException) {
                _uiState.value = LoginUiState(error = parseErrorMessage(e) ?: "로그인에 실패했어요.")
            } catch (e: Exception) {
                _uiState.value = LoginUiState(error = e.message ?: "로그인 중 오류가 발생했어요.")
            }
        }
    }
}
