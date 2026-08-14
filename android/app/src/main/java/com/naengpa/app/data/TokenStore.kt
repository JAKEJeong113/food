package com.naengpa.app.data

import android.content.Context
import android.content.SharedPreferences

/**
 * 세션 토큰 저장소. 지금은 평문 SharedPreferences를 쓴다.
 * TODO: 프로덕션 전환 시 androidx.security:security-crypto의
 * EncryptedSharedPreferences로 교체할 것 (새 의존성이라 이 검증 단계에서는
 * 보류했다).
 */
object TokenStore {
    private const val PREFS_NAME = "auth"
    private const val KEY_TOKEN = "token"

    private var prefs: SharedPreferences? = null

    fun init(context: Context) {
        prefs = context.applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    var token: String?
        get() = prefs?.getString(KEY_TOKEN, null)
        set(value) {
            prefs?.edit()?.apply {
                if (value == null) remove(KEY_TOKEN) else putString(KEY_TOKEN, value)
            }?.apply()
        }
}
