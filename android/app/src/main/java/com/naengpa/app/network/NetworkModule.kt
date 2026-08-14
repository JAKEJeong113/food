package com.naengpa.app.network

import com.naengpa.app.BuildConfig
import com.naengpa.app.data.SessionManager
import com.naengpa.app.data.TokenStore
import kotlinx.serialization.json.Json
import okhttp3.Interceptor
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory
import java.util.concurrent.TimeUnit

object NetworkModule {

    private val json = Json {
        ignoreUnknownKeys = true
        coerceInputValues = true
    }

    private val authInterceptor = Interceptor { chain ->
        val token = TokenStore.token
        val requestBuilder = chain.request().newBuilder()
        if (token != null) {
            requestBuilder.addHeader("Authorization", "Bearer $token")
        }
        val response = chain.proceed(requestBuilder.build())

        // 로그인/회원가입 자체가 401(잘못된 비밀번호 등)을 낼 수도 있으므로,
        // "토큰을 들고 있었는데 거부당한 경우"에만 세션 만료로 취급한다.
        if (response.code == 401 && token != null) {
            SessionManager.notifyLoggedOut()
        }

        response
    }

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .addInterceptor(authInterceptor)
        .apply {
            if (BuildConfig.DEBUG) {
                addInterceptor(
                    HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC }
                )
            }
        }
        .build()

    val api: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(client)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()
            .create(ApiService::class.java)
    }
}
