package com.naengpa.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.naengpa.app.ui.NaengpaApp
import com.naengpa.app.ui.theme.NaengpaTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NaengpaTheme {
                NaengpaApp()
            }
        }
    }
}
