<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentAchivementsController;
use App\Http\Controllers\StudentInternshipController;
use App\Models\StudentAchivements;
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


Route::middleware(['auth:sanctum','verified', 'ability:token-student'])->group(function () {
    Route::post("/student/add/internship",[StudentInternshipController::class,'store']);
    Route::get("/student/fetch/internships",[StudentInternshipController::class,'fetch']);
    Route::post("/student/update/internship",[StudentInternshipController::class,'update']);

    Route::post("/student/add/achievement",[StudentAchivementsController::class,'store']);
    Route::get("/student/fetch/achievements",[StudentAchivementsController::class,'fetch']);
    Route::post("/student/update/achievement",[StudentAchivementsController::class,'update']);

});


Route::middleware(['auth:sanctum','verified', 'ability:token-student,token-admin'])->group(function () {
    Route::post('/update/profile',[ProfileController::class,'update']);
});


require __DIR__.'/auth.php';
