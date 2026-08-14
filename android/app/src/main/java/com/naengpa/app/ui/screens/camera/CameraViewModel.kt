package com.naengpa.app.ui.screens.camera

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import androidx.core.content.FileProvider
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.naengpa.app.data.AnalyzeRequest
import com.naengpa.app.data.DetectedIngredient
import com.naengpa.app.data.InventoryItemInput
import com.naengpa.app.data.InventorySaveRequest
import com.naengpa.app.network.NetworkModule
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream
import java.io.File
import java.util.Base64

enum class CameraStage { IDLE, ANALYZING, REVIEWING, SAVING }

data class CameraUiState(
    val stage: CameraStage = CameraStage.IDLE,
    val items: List<DetectedIngredient> = emptyList(),
    val usedMock: Boolean = false,
    val error: String? = null
)

private const val MAX_IMAGE_DIMENSION = 1280
private const val JPEG_QUALITY = 85

class CameraViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(CameraUiState())
    val uiState: StateFlow<CameraUiState> = _uiState.asStateFlow()

    /** 카메라 앱이 사진을 저장할 위치. 앱 캐시 내부이므로 별도 저장소 권한이 필요 없다. */
    fun createImageCaptureUri(context: Context): Uri {
        val imagesDir = File(context.cacheDir, "images").apply { mkdirs() }
        val file = File(imagesDir, "fridge_${System.currentTimeMillis()}.jpg")
        return FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", file)
    }

    fun analyzeImage(context: Context, uri: Uri) {
        _uiState.value = _uiState.value.copy(stage = CameraStage.ANALYZING, error = null)
        viewModelScope.launch {
            try {
                val (base64, mediaType) = withContext(Dispatchers.IO) { encodeImage(context, uri) }
                val response = NetworkModule.api.analyzeFridge(AnalyzeRequest(base64, mediaType))
                _uiState.value = CameraUiState(
                    stage = CameraStage.REVIEWING,
                    items = response.items,
                    usedMock = response.usedMock
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    stage = CameraStage.IDLE,
                    error = e.message ?: "재료 인식에 실패했어요."
                )
            }
        }
    }

    private fun encodeImage(context: Context, uri: Uri): Pair<String, String> {
        val original = context.contentResolver.openInputStream(uri)?.use { stream ->
            BitmapFactory.decodeStream(stream)
        } ?: error("이미지를 읽을 수 없어요.")

        val scale = minOf(1f, MAX_IMAGE_DIMENSION.toFloat() / maxOf(original.width, original.height))
        val resized = if (scale < 1f) {
            Bitmap.createScaledBitmap(
                original,
                (original.width * scale).toInt(),
                (original.height * scale).toInt(),
                true
            )
        } else {
            original
        }

        val output = ByteArrayOutputStream()
        resized.compress(Bitmap.CompressFormat.JPEG, JPEG_QUALITY, output)
        val base64 = Base64.getEncoder().encodeToString(output.toByteArray())
        return base64 to "image/jpeg"
    }

    fun updateQuantity(index: Int, delta: Double) {
        val current = _uiState.value.items.toMutableList()
        val item = current[index]
        current[index] = item.copy(quantity = maxOf(0.0, item.quantity + delta))
        _uiState.value = _uiState.value.copy(items = current)
    }

    fun removeItem(index: Int) {
        val current = _uiState.value.items.toMutableList()
        current.removeAt(index)
        _uiState.value = _uiState.value.copy(items = current)
    }

    fun confirmAll(onDone: () -> Unit) {
        val items = _uiState.value.items
        if (items.isEmpty()) return

        _uiState.value = _uiState.value.copy(stage = CameraStage.SAVING)
        viewModelScope.launch {
            try {
                NetworkModule.api.saveInventory(
                    InventorySaveRequest(
                        items.map {
                            InventoryItemInput(
                                ingredientId = it.ingredientId,
                                quantity = it.quantity,
                                unit = it.unit,
                                defaultShelfLifeDays = it.defaultShelfLifeDays
                            )
                        }
                    )
                )
                _uiState.value = CameraUiState()
                onDone()
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    stage = CameraStage.REVIEWING,
                    error = e.message ?: "냉장고에 반영하는 중 오류가 발생했어요."
                )
            }
        }
    }
}
