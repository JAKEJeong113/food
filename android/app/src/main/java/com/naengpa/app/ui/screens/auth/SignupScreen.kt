package com.naengpa.app.ui.screens.auth

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.weight
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignupScreen(
    onSignedUp: () -> Unit,
    onNavigateToLogin: () -> Unit,
    viewModel: SignupViewModel = viewModel()
) {
    val state by viewModel.uiState.collectAsState()

    if (state.success != null) {
        SignupSuccessCard(success = state.success!!, onContinue = onSignedUp)
        return
    }

    var mode by remember { mutableStateOf(HouseholdMode.CREATE) }
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var householdName by remember { mutableStateOf("") }
    var inviteCode by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp)
            .padding(top = 48.dp)
    ) {
        Text("회원가입", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        Text("우리 집 냉장고를 함께 관리해요.", style = MaterialTheme.typography.bodyMedium)

        Spacer(Modifier.height(24.dp))

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("이름") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("이메일") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("비밀번호 (8자 이상)") },
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(Modifier.height(16.dp))
        SingleChoiceSegmentedButtonRow(modifier = Modifier.fillMaxWidth()) {
            SegmentedButton(
                selected = mode == HouseholdMode.CREATE,
                onClick = { mode = HouseholdMode.CREATE },
                shape = SegmentedButtonDefaults.itemShape(index = 0, count = 2)
            ) {
                Text("새 가구 만들기")
            }
            SegmentedButton(
                selected = mode == HouseholdMode.JOIN,
                onClick = { mode = HouseholdMode.JOIN },
                shape = SegmentedButtonDefaults.itemShape(index = 1, count = 2)
            ) {
                Text("초대코드로 합류")
            }
        }

        Spacer(Modifier.height(8.dp))
        if (mode == HouseholdMode.CREATE) {
            OutlinedTextField(
                value = householdName,
                onValueChange = { householdName = it },
                label = { Text("우리 집 이름 (예: 정상경네 냉장고)") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )
        } else {
            OutlinedTextField(
                value = inviteCode,
                onValueChange = { inviteCode = it.uppercase() },
                label = { Text("초대코드 6자리") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )
        }

        state.error?.let {
            Spacer(Modifier.height(8.dp))
            Text(it, color = MaterialTheme.colorScheme.error)
        }

        val householdFieldFilled =
            if (mode == HouseholdMode.CREATE) householdName.isNotBlank() else inviteCode.isNotBlank()

        Spacer(Modifier.height(16.dp))
        Button(
            onClick = {
                viewModel.register(name, email, password, mode, householdName, inviteCode)
            },
            enabled = !state.loading &&
                name.isNotBlank() && email.isNotBlank() && password.length >= 8 && householdFieldFilled,
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
        ) {
            Text(if (state.loading) "가입 중..." else "회원가입")
        }

        Spacer(Modifier.height(16.dp))
        TextButton(onClick = onNavigateToLogin, modifier = Modifier.fillMaxWidth()) {
            Text("이미 계정이 있나요? 로그인")
        }
    }
}

@Composable
private fun SignupSuccessCard(success: SignupSuccess, onContinue: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp)
            .padding(top = 96.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("🎉", style = MaterialTheme.typography.displayMedium)
        Spacer(Modifier.height(12.dp))
        Text(
            "${success.householdName} 가입 완료!",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold
        )

        if (success.mode == HouseholdMode.CREATE) {
            Spacer(Modifier.height(16.dp))
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        "가족에게 이 초대코드를 알려주면 같은 냉장고를 함께 관리할 수 있어요.",
                        style = MaterialTheme.typography.bodySmall
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(
                        success.inviteCode,
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }

        Spacer(Modifier.height(32.dp))
        Button(
            onClick = onContinue,
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
        ) {
            Text("시작하기")
        }
    }
}
