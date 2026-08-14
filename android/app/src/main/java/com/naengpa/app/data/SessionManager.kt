package com.naengpa.app.data

import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow

/** 서버가 401을 응답하면(세션 만료 등) 토큰을 지우고 로그인 화면으로 보내라고 알린다. */
object SessionManager {
    private val _loggedOut = MutableSharedFlow<Unit>(extraBufferCapacity = 1)
    val loggedOut = _loggedOut.asSharedFlow()

    fun notifyLoggedOut() {
        TokenStore.token = null
        _loggedOut.tryEmit(Unit)
    }
}
