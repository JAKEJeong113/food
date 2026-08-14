package com.naengpa.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = Fresh600,
    onPrimary = Color.White,
    primaryContainer = Fresh100,
    background = LightBackground,
    surface = Color.White
)

private val DarkColors = darkColorScheme(
    primary = Fresh500,
    onPrimary = Color.Black,
    background = DarkBackground,
    surface = DarkSurface
)

@Composable
fun NaengpaTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colors = if (darkTheme) DarkColors else LightColors
    MaterialTheme(
        colorScheme = colors,
        content = content
    )
}
