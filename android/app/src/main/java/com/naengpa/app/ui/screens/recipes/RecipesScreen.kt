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
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
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
                            }
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
    onToggleExpand: () -> Unit
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
                }
                Text(
                    "${recipe.score}",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
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

            TextButton(onClick = onToggleExpand) {
                Text(if (expanded) "레시피 접기 ▲" else "레시피 보기 ▼")
            }

            if (expanded) {
                Text(recipe.description, style = MaterialTheme.typography.bodyMedium)
            }
        }
    }
}
