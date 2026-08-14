package com.naengpa.app.network

import com.naengpa.app.data.ErrorResponse
import kotlinx.serialization.json.Json
import retrofit2.HttpException

private val errorJson = Json { ignoreUnknownKeys = true }

/** 실패 응답 바디의 {"error": "..."}를 사람이 읽을 문구로 뽑아낸다. */
fun parseErrorMessage(e: HttpException): String? {
    return try {
        val body = e.response()?.errorBody()?.string() ?: return null
        errorJson.decodeFromString<ErrorResponse>(body).error
    } catch (_: Exception) {
        null
    }
}
