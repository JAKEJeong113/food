package com.naengpa.app.ui.screens.recipes

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.naengpa.app.data.RecipeRecommendation

@Composable
fun RecipesScreen(viewModel: RecipesViewModel = viewModel()) {
    val state by viewModel.uiState.collectAsState()
    var expandedId by remember { mutableStateOf<Int?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp, vertical = 24.dp)
    ) {
        Text("오늘의 추천", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(12.dp))

        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(CUISINE_OPTIONS) { option ->
                val selected = (state.filters.cuisine ?: "전체") == option
                FilterChip(
                    selected = selected,
                    onClick = { viewModel.selectCuisine(option) },
                    label = { Text(option) }
                )
            }
        }

        Spacer(Modifier.height(8.dp))

        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            item {
                FilterChip(
                    selected = state.filters.maxTime == 20,
                    onClick = { viewModel.toggleMaxTime(20) },
                    label = { Text("20분 이내") }
                )
            }
            item {
                FilterChip(
                    selected = state.filters.kidFriendly,
                    onClick = { viewModel.toggleKidFriendly() },
                    label = { Text("아이와 함께") }
                )
            }
            item {
                FilterChip(
                    selected = state.filters.noShopping,
                    onClick = { viewModel.toggleNoShopping() },
                    label = { Text("추가 장보기 없음") }
                )
            }
            item {
                FilterChip(
                    selected = state.filters.spicy,
                    onClick = { viewModel.toggleSpicy() },
                    label = { Text("매운맛") }
                )
            }
            item {
                FilterChip(
                    selected = state.filters.diet,
                    onClick = { viewModel.toggleDiet() },
                    label = { Text("다이어트식") }
                )
            }
            item {
                FilterChip(
                    selected = state.filters.babyFood,
                    onClick = { viewModel.toggleBabyFood() },
                    label = { Text("유아식") }
                )
            }
            item {
                FilterChip(
                    selected = state.filters.fried,
                    onClick = { viewModel.toggleFried() },
                    label = { Text("튀김") }
                )
            }
        }

        Spacer(Modifier.height(16.dp))

        when {
            state.loading -> {
                Box(
                    Modifier
                        .fillMaxWidth()
                        .padding(top = 32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }

            state.recommendations.isEmpty() -> {
                Text(
                    "조건에 맞는 요리가 없어요. 필터를 바꿔보세요.",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 32.dp)
                )
            }

            else -> {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(state.recommendations, key = { it.recipeId }) { recipe ->
                        RecipeCard(
                            recipe = recipe,
                            expanded = expandedId == recipe.recipeId,
                            onToggleExpand = {
                                expandedId = if (expandedId == recipe.recipeId) null else recipe.recipeId
                            },
                            cookState = state.cookStates[recipe.recipeId] ?: CookUiState(),
                            onStartCooking = { viewModel.startCooking(recipe.recipeId) },
                            onCancelCooking = { viewModel.cancelCooking(recipe.recipeId) },
                            onConfirmCooking = { viewModel.confirmCooking(recipe.recipeId) }
                        )
                    }
                }
            }
        }

        state.error?.let {
            Spacer(Modifier.height(12.dp))
            Text(it, color = MaterialTheme.colorScheme.error)
        }
    }
}

@Composable
private fun RecipeCard(
    recipe: RecipeRecommendation,
    expanded: Boolean,
    onToggleExpand: () -> Unit,
    cookState: CookUiState,
    onStartCooking: () -> Unit,
    onCancelCooking: () -> Unit,
    onConfirmCooking: () -> Unit
) {
    ElevatedCard(modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp)) {
            Row(
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(Modifier.weight(1f)) {
                    Text(recipe.title, fontWeight = FontWeight.SemiBold)
                    Text(
                        "재료 보유율 ${recipe.matchRate}% · ⏱ ${recipe.cookTimeMinutes}분 · ${recipe.servings}인분" +
                            if (recipe.kidFriendly) " · 👨‍👩‍👧 가족메뉴" else "",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(Modifier.height(4.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        AssistChip(onClick = {}, label = { Text(recipe.cuisineType) })
                        AssistChip(onClick = {}, label = { Text(recipe.cookingMethod) })
                    }
                }
                Text(
                    "${recipe.score}",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            if (recipe.spicyLevel > 0 || recipe.isDiet || recipe.isBabyFood) {
                Spacer(Modifier.height(6.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    if (recipe.spicyLevel > 0) {
                        AssistChip(onClick = {}, label = { Text("매운맛 " + "🌶".repeat(recipe.spicyLevel)) })
                    }
                    if (recipe.isDiet) {
                        AssistChip(onClick = {}, label = { Text("다이어트식") })
                    }
                    if (recipe.isBabyFood) {
                        AssistChip(onClick = {}, label = { Text("유아식") })
                    }
                }
            }

            Spacer(Modifier.height(6.dp))
            Text(recipe.reason, style = MaterialTheme.typography.bodySmall)

            if (recipe.missing.isNotEmpty()) {
                Spacer(Modifier.height(6.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    recipe.missing.forEach { missing ->
                        AssistChip(onClick = {}, label = { Text("$missing 없음") })
                    }
                }
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                TextButton(onClick = onToggleExpand) {
                    Text(if (expanded) "레시피 접기 ▲" else "레시피 보기 ▼")
                }
                if (cookState.stage == CookStage.IDLE) {
                    TextButton(onClick = onStartCooking) {
                        Text("이걸로 먹을래")
                    }
                }
            }

            if (expanded) {
                Text(recipe.description, style = MaterialTheme.typography.bodyMedium)
            }

            if (cookState.stage == CookStage.LOADING) {
                Spacer(Modifier.height(8.dp))
                Text(
                    "재고를 확인하고 있어요...",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (cookState.stage == CookStage.READY || cookState.stage == CookStage.SAVING) {
                Spacer(Modifier.height(8.dp))
                if (cookState.items.isEmpty()) {
                    Text(
                        "차감할 재고가 없어요. 그래도 조리 기록만 남길까요?",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                } else {
                    Text(
                        "사용한 재료를 냉장고에서 반영할까요?",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(Modifier.height(4.dp))
                    Column {
                        cookState.items.forEach { item ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(item.name, style = MaterialTheme.typography.bodySmall)
                                Text(
                                    "${formatQuantity(item.currentQuantity)}${item.unit} → " +
                                        "${formatQuantity(item.afterQuantity)}${item.unit}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }

                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(
                        onClick = onCancelCooking,
                        enabled = cookState.stage != CookStage.SAVING,
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("취소")
                    }
                    Button(
                        onClick = onConfirmCooking,
                        enabled = cookState.stage != CookStage.SAVING,
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(if (cookState.stage == CookStage.SAVING) "반영 중..." else "반영하기")
                    }
                }
            }

            if (cookState.stage == CookStage.DONE) {
                Spacer(Modifier.height(8.dp))
                Text(
                    "🎉 반영했어요! 냉장고 재고가 업데이트됐어요.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

private fun formatQuantity(value: Double): String =
    if (value == value.toLong().toDouble()) value.toLong().toString() else value.toString()
