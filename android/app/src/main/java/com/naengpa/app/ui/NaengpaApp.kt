package com.naengpa.app.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.naengpa.app.data.SessionManager
import com.naengpa.app.data.TokenStore
import com.naengpa.app.ui.screens.auth.LoginScreen
import com.naengpa.app.ui.screens.auth.SignupScreen
import com.naengpa.app.ui.screens.camera.CameraScreen
import com.naengpa.app.ui.screens.home.HomeScreen
import com.naengpa.app.ui.screens.recipes.RecipesScreen

sealed class Screen(val route: String, val label: String) {
    data object Login : Screen("login", "로그인")
    data object Signup : Screen("signup", "회원가입")
    data object Home : Screen("home", "홈")
    data object Camera : Screen("camera", "촬영")
    data object Recipes : Screen("recipes", "요리")
}

private val bottomNavItems = listOf(Screen.Home, Screen.Camera, Screen.Recipes)
private val authRoutes = setOf(Screen.Login.route, Screen.Signup.route)

@Composable
fun NaengpaApp() {
    val navController = rememberNavController()
    val startDestination = if (TokenStore.token != null) Screen.Home.route else Screen.Login.route

    LaunchedEffect(Unit) {
        SessionManager.loggedOut.collect {
            navController.navigate(Screen.Login.route) {
                popUpTo(0)
            }
        }
    }

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    val showBottomBar = currentRoute !in authRoutes

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                NavigationBar {
                    val currentDestination = navBackStackEntry?.destination

                    bottomNavItems.forEach { screen ->
                        val selected =
                            currentDestination?.hierarchy?.any { it.route == screen.route } == true
                        NavigationBarItem(
                            selected = selected,
                            onClick = {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = {
                                Icon(
                                    imageVector = when (screen) {
                                        Screen.Home -> Icons.Filled.Home
                                        Screen.Camera -> Icons.Filled.CameraAlt
                                        Screen.Recipes -> Icons.Filled.Restaurant
                                        else -> Icons.Filled.Home
                                    },
                                    contentDescription = screen.label
                                )
                            },
                            label = { Text(screen.label) }
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = startDestination,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Login.route) {
                LoginScreen(
                    onLoggedIn = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(0)
                        }
                    },
                    onNavigateToSignup = { navController.navigate(Screen.Signup.route) }
                )
            }
            composable(Screen.Signup.route) {
                SignupScreen(
                    onSignedUp = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(0)
                        }
                    },
                    onNavigateToLogin = { navController.navigate(Screen.Login.route) }
                )
            }
            composable(Screen.Home.route) {
                HomeScreen(
                    onNavigateToCamera = { navController.navigate(Screen.Camera.route) },
                    onLoggedOut = {
                        navController.navigate(Screen.Login.route) {
                            popUpTo(0)
                        }
                    }
                )
            }
            composable(Screen.Camera.route) {
                CameraScreen(
                    onDone = {
                        navController.navigate(Screen.Recipes.route) {
                            popUpTo(Screen.Home.route)
                        }
                    }
                )
            }
            composable(Screen.Recipes.route) {
                RecipesScreen()
            }
        }
    }
}
