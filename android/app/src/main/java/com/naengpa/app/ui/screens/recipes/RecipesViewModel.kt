package com.naengpa.app.ui.screens.recipes

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.naengpa.app.data.RecipeRecommendation
import com.naengpa.app.network.NetworkModule
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class RecipeFilters(
    val maxTime: Int? = null,
    val kidFriendly: Boolean = false,
    val noShopping: Boolean = false
)

data class RecipesUiState(
    val loading: Boolean = true,
    val filters: RecipeFilters = RecipeFilters(),
    val recommendations: List<RecipeRecommendation> = emptyList(),
    val error: String? = null
)

class RecipesViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(RecipesUiState())
    val uiState: StateFlow<RecipesUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun toggleMaxTime(value: Int) {
        val current = _uiState.value.filters
        _uiState.value = _uiState.value.copy(
            filters = current.copy(maxTime = if (current.maxTime == value) null else value)
        )
        load()
    }

    fun toggleKidFriendly() {
        val current = _uiState.value.filters
        _uiState.value = _uiState.value.copy(filters = current.copy(kidFriendly = !current.kidFriendly))
        load()
    }

    fun toggleNoShopping() {
        val current = _uiState.value.filters
        _uiState.value = _uiState.value.copy(filters = current.copy(noShopping = !current.noShopping))
        load()
    }

    private fun load() {
        val filters = _uiState.value.filters
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(loading = true, error = null)
            try {
                val response = NetworkModule.api.recommend(
                    maxTime = filters.maxTime,
                    kidFriendly = if (filters.kidFriendly) 1 else null,
                    noShopping = if (filters.noShopping) 1 else null
                )
                _uiState.value = _uiState.value.copy(
                    loading = false,
                    recommendations = response.recommendations
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
