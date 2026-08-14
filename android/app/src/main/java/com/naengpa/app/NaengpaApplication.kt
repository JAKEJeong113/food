package com.naengpa.app

import android.app.Application
import com.naengpa.app.data.TokenStore

class NaengpaApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        TokenStore.init(this)
    }
}
