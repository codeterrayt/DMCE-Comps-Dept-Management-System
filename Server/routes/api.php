<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/fetch/profile', function (Request $request) {
    return $request->user();
});


Route::middleware(['auth:sanctum','verified', 'ability:token-admin'])->group(function () {
    Route::get('/test', function (Request $request) {
        return $request->user();
    });
});


Route::middleware(['auth:sanctum','verified', 'ability:token-student'])->group(function () {
    Route::post('/update/profile',[ProfileController::class,'update']);
});


require __DIR__.'/auth.php';
