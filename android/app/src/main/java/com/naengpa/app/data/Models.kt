package com.naengpa.app.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class AnalyzeRequest(
    val image: String,
    val mediaType: String
)

@Serializable
data class DetectedIngredient(
    val ingredientId: Int,
    val name: String,
    val quantity: Double,
    val unit: String,
    val confidence: Double,
    val storageType: String,
    val defaultShelfLifeDays: Int? = null
)

@Serializable
data class AnalyzeResponse(
    val items: List<DetectedIngredient>,
    val usedMock: Boolean
)

@Serializable
data class InventoryItemInput(
    val ingredientId: Int,
    val quantity: Double,
    val unit: String,
    val defaultShelfLifeDays: Int? = null
)

@Serializable
data class InventorySaveRequest(
    val items: List<InventoryItemInput>
)

@Serializable
data class InventorySaveResponse(
    val ok: Boolean
)

@Serializable
data class InventoryItem(
    val id: Int,
    val quantity: Double,
    val unit: String,
    @SerialName("expiry_date") val expiryDate: String? = null,
    @SerialName("storage_location") val storageLocation: String? = null,
    @SerialName("ingredient_id") val ingredientId: Int,
    @SerialName("name_ko") val nameKo: String,
    val category: String,
    @SerialName("storage_type") val storageType: String,
    @SerialName("is_basic_seasoning") val isBasicSeasoning: Int
)

@Serializable
data class InventoryListResponse(
    val items: List<InventoryItem>
)

@Serializable
data class RecipeRecommendation(
    val recipeId: Int,
    val title: String,
    val description: String,
    val servings: Int,
    val cookTimeMinutes: Int,
    val kidFriendly: Boolean,
    val spicyLevel: Int,
    val cuisineType: String,
    val cookingMethod: String,
    val isDiet: Boolean,
    val isBabyFood: Boolean,
    val score: Int,
    val matchRate: Int,
    val missing: List<String>,
    val reason: String
)

@Serializable
data class RecommendResponse(
    val recommendations: List<RecipeRecommendation>
)

@Serializable
data class AuthUserDto(
    val id: Int,
    val email: String,
    val name: String,
    val householdId: Int,
    val householdName: String,
    val inviteCode: String
)

@Serializable
data class AuthResponse(
    val token: String,
    val user: AuthUserDto
)

@Serializable
data class MeResponse(
    val user: AuthUserDto
)

@Serializable
data class LoginRequest(
    val email: String,
    val password: String
)

@Serializable
data class RegisterRequest(
    val email: String,
    val password: String,
    val name: String,
    val householdName: String? = null,
    val inviteCode: String? = null,
    val agreedToPrivacy: Boolean = false
)

@Serializable
data class ErrorResponse(
    val error: String
)

@Serializable
data class DeductionItem(
    val ingredientId: Int,
    val name: String,
    val unit: String,
    val currentQuantity: Double,
    val afterQuantity: Double,
    val deducted: Double
)

@Serializable
data class DeductionPreviewResponse(
    val items: List<DeductionItem>
)

@Serializable
data class CookResponse(
    val ok: Boolean,
    val items: List<DeductionItem>
)
