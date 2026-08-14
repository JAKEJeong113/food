package com.naengpa.app.ui.screens.recipes

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.naengpa.app.data.DeductionItem
import com.naengpa.app.data.RecipeRecommendation
import com.naengpa.app.network.NetworkModule
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class RecipeFilters(
    val maxTime: Int? = null,
    val kidFriendly: Boolean = false,
    val noShopping: Boolean = false,
    val cuisine: String? = null, // null = 전체
    val spicy: Boolean = false,
    val diet: Boolean = false,
    val babyFood: Boolean = false,
    val fried: Boolean = false
)

enum class CookStage { IDLE, LOADING, READY, SAVING, DONE }

data class CookUiState(
    val stage: CookStage = CookStage.IDLE,
    val items: List<DeductionItem> = emptyList()
)

data class RecipesUiState(
    val loading: Boolean = true,
    val filters: RecipeFilters = RecipeFilters(),
    val recommendations: List<RecipeRecommendation> = emptyList(),
    val cookStates: Map<Int, CookUiState> = emptyMap(),
    val error: String? = null
)

val CUISINE_OPTIONS = listOf("전체", "한식", "중식", "양식")

class RecipesViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(RecipesUiState())
    val uiState: StateFlow<RecipesUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun toggleMaxTime(value: Int) {
        updateFilters { it.copy(maxTime = if (it.maxTime == value) null else value) }
    }

    fun toggleKidFriendly() = updateFilters { it.copy(kidFriendly = !it.kidFriendly) }
    fun toggleNoShopping() = updateFilters { it.copy(noShopping = !it.noShopping) }
    fun toggleSpicy() = updateFilters { it.copy(spicy = !it.spicy) }
    fun toggleDiet() = updateFilters { it.copy(diet = !it.diet) }
    fun toggleBabyFood() = updateFilters { it.copy(babyFood = !it.babyFood) }
    fun toggleFried() = updateFilters { it.copy(fried = !it.fried) }

    fun selectCuisine(option: String) {
        updateFilters { it.copy(cuisine = if (option == "전체") null else option) }
    }

    fun startCooking(recipeId: Int) {
        setCookState(recipeId, CookUiState(stage = CookStage.LOADING))
        viewModelScope.launch {
            try {
                val response = NetworkModule.api.deductionPreview(recipeId)
                setCookState(recipeId, CookUiState(stage = CookStage.READY, items = response.items))
            } catch (e: Exception) {
                setCookState(recipeId, CookUiState(stage = CookStage.IDLE))
            }
        }
    }

    fun cancelCooking(recipeId: Int) {
        setCookState(recipeId, CookUiState(stage = CookStage.IDLE))
    }

    fun confirmCooking(recipeId: Int) {
        val current = _uiState.value.cookStates[recipeId] ?: CookUiState()
        setCookState(recipeId, current.copy(stage = CookStage.SAVING))
        viewModelScope.launch {
            try {
                NetworkModule.api.cookRecipe(recipeId)
                setCookState(recipeId, current.copy(stage = CookStage.DONE))
                load()
            } catch (e: Exception) {
                setCookState(recipeId, current.copy(stage = CookStage.READY))
            }
        }
    }

    private fun setCookState(recipeId: Int, state: CookUiState) {
        val updated = _uiState.value.cookStates.toMutableMap()
        updated[recipeId] = state
        _uiState.value = _uiState.value.copy(cookStates = updated)
    }

    private fun updateFilters(transform: (RecipeFilters) -> RecipeFilters) {
        _uiState.value = _uiState.value.copy(filters = transform(_uiState.value.filters))
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
                    noShopping = if (filters.noShopping) 1 else null,
                    cuisine = filters.cuisine,
                    cookingMethod = if (filters.fried) "튀김" else null,
                    spicy = if (filters.spicy) 1 else null,
                    diet = if (filters.diet) 1 else null,
                    babyFood = if (filters.babyFood) 1 else null
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
