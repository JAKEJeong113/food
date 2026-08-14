package com.naengpa.app.ui.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.naengpa.app.data.RecipeRecommendation
import com.naengpa.app.network.NetworkModule
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class HomeUiState(
    val loading: Boolean = true,
    val itemCount: Int = 0,
    val recommendations: List<RecipeRecommendation> = emptyList(),
    val error: String? = null
)

class HomeViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    fun refresh() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true, error = null)
            try {
                val inventory = NetworkModule.api.getInventory()
                val nonSeasoningCount = inventory.items.count { it.isBasicSeasoning == 0 }
                val recommendations = if (nonSeasoningCount > 0) {
                    NetworkModule.api.recommend().recommendations
                } else {
                    emptyList()
                }
                _uiState.value = HomeUiState(
                    loading = false,
                    itemCount = nonSeasoningCount,
                    recommendations = recommendations
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    loading = false,
                    error = e.message ?: "불러오기에 실패했어요."
                )
            }
        }
    }
}
