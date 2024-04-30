<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentAchivementsController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentExtraCuController;
use App\Http\Controllers\StudentHackathonsController;
use App\Http\Controllers\StudentHigherStudiesController;
use App\Http\Controllers\StudentInternshipController;
use App\Http\Controllers\StudentPlacementsController;
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



Route::middleware(['auth:sanctum','verified', 'ability:token-student'])->group(function () {
    Route::post("/student/add/internship",[StudentInternshipController::class,'store']);
    Route::get("/student/fetch/internships",[StudentInternshipController::class,'fetch']);
    Route::post("/student/update/internship",[StudentInternshipController::class,'update']);
    Route::post("/student/delete/internship",[StudentInternshipController::class,'destroy']);
    Route::get("/student/fetch/internship/{id}",[StudentInternshipController::class,'fetchInternshipByID']);

    Route::post("/student/add/achievement",[StudentAchivementsController::class,'store']);
    Route::get("/student/fetch/achievements",[StudentAchivementsController::class,'fetch']);
    Route::post("/student/update/achievement",[StudentAchivementsController::class,'update']);
    Route::post("/student/delete/achievement",[StudentAchivementsController::class,'destroy']);

    Route::post("/student/add/extra-curricular-activities",[StudentExtraCuController::class,'store']);
    Route::get("/student/fetch/extra-curricular-activities",[StudentExtraCuController::class,'fetch']);
    Route::post("/student/update/extra-curricular-activities",[StudentExtraCuController::class,'update']);
    Route::post("/student/delete/extra-curricular-activities",[StudentExtraCuController::class,'destroy']);

    Route::post("/student/add/hackathon",[StudentHackathonsController::class,'store']);
    Route::get("/student/fetch/hackathon",[StudentHackathonsController::class,'fetch']);
    Route::post("/student/update/hackathon",[StudentHackathonsController::class,'update']);
    Route::post("/student/delete/hackathon",[StudentHackathonsController::class,'destroy']);

    Route::post("/student/add/higher-studies",[StudentHigherStudiesController::class,'store']);
    Route::get("/student/fetch/higher-studies",[StudentHigherStudiesController::class,'fetch']);
    Route::post("/student/update/higher-studies",[StudentHigherStudiesController::class,'update']);
    Route::post("/student/delete/higher-studies",[StudentHigherStudiesController::class,'destroy']);

    Route::post("/student/add/placement",[StudentPlacementsController::class,'store']);
    Route::get("/student/fetch/placement",[StudentPlacementsController::class,'fetch']);
    Route::post("/student/update/placement",[StudentPlacementsController::class,'update']);
    Route::post("/student/delete/placement",[StudentPlacementsController::class,'destroy']);

});

Route::middleware(['auth:sanctum','verified', 'ability:token-admin'])->group(function () {
    Route::post('/update/profile',[ProfileController::class,'update']);
    Route::get("/admin/fetch/students",[StudentController::class,"index"]);
    Route::get("/admin/fetch/internship",[StudentController::class,'fetch_internship_by_student_id']);
    Route::get("/admin/fetch/ecc",[StudentController::class,'fetch_ecc_by_student_id']);
    Route::get("/admin/fetch/achievements",[StudentController::class,'fetch_achievements_by_student_id']);
    Route::get("/admin/fetch/hackathons",[StudentController::class,'fetch_hackathons_by_student_id']);
    Route::get("/admin/fetch/higher-studies",[StudentController::class,'fetch_higherstudies_by_student_id']);
    Route::get("/admin/fetch/placements",[StudentController::class,'fetch_placements_by_student_id']);
});

Route::middleware(['auth:sanctum','verified', 'ability:token-student,token-admin'])->group(function () {
    Route::post('/update/profile',[ProfileController::class,'update']);
    Route::get('/fetch/profile', function (Request $request) {
        return $request->user();
    });
});


require __DIR__.'/auth.php';
