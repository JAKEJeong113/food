package com.naengpa.app.network

import com.naengpa.app.data.AnalyzeRequest
import com.naengpa.app.data.AnalyzeResponse
import com.naengpa.app.data.InventoryListResponse
import com.naengpa.app.data.InventorySaveRequest
import com.naengpa.app.data.InventorySaveResponse
import com.naengpa.app.data.RecommendResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface ApiService {

    @POST("api/fridge/analyze")
    suspend fun analyzeFridge(@Body request: AnalyzeRequest): AnalyzeResponse

    @GET("api/inventory")
    suspend fun getInventory(): InventoryListResponse

    @POST("api/inventory")
    suspend fun saveInventory(@Body request: InventorySaveRequest): InventorySaveResponse

    @GET("api/recipes/recommend")
    suspend fun recommend(
        @Query("maxTime") maxTime: Int? = null,
        @Query("kidFriendly") kidFriendly: Int? = null,
        @Query("noShopping") noShopping: Int? = null,
        @Query("cuisine") cuisine: String? = null,
        @Query("cookingMethod") cookingMethod: String? = null,
        @Query("spicy") spicy: Int? = null,
        @Query("diet") diet: Int? = null,
        @Query("babyFood") babyFood: Int? = null
    ): RecommendResponse
}
