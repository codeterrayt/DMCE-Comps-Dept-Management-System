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
    Route::get("/student/fetch/achievement/{id}",[StudentAchivementsController::class,'fetchAchivementByID']);

    Route::post("/student/add/extra-curricular-activities",[StudentExtraCuController::class,'store']);
    Route::get("/student/fetch/extra-curricular-activities",[StudentExtraCuController::class,'fetch']);
    Route::post("/student/update/extra-curricular-activities",[StudentExtraCuController::class,'update']);
    Route::post("/student/delete/extra-curricular-activities",[StudentExtraCuController::class,'destroy']);
    Route::get("/student/fetch/extra-curricular-activities/{id}",[StudentExtraCuController::class,'fetchEccById']);

    Route::post("/student/add/hackathon",[StudentHackathonsController::class,'store']);
    Route::get("/student/fetch/hackathon",[StudentHackathonsController::class,'fetch']);
    Route::post("/student/update/hackathon",[StudentHackathonsController::class,'update']);
    Route::post("/student/delete/hackathon",[StudentHackathonsController::class,'destroy']);
    Route::get("/student/fetch/hackathon/{id}",[StudentHackathonsController::class,'fetch_hackathon_by_id']);

    Route::post("/student/add/higher-studies",[StudentHigherStudiesController::class,'store']);
    Route::get("/student/fetch/higher-studies",[StudentHigherStudiesController::class,'fetch']);
    Route::post("/student/update/higher-studies",[StudentHigherStudiesController::class,'update']);
    Route::post("/student/delete/higher-studies",[StudentHigherStudiesController::class,'destroy']);
    Route::get("/student/fetch/higher-studies/{id}",[StudentHigherStudiesController::class,'fetch_hs_by_id']);

    Route::post("/student/add/placement",[StudentPlacementsController::class,'store']);
    Route::get("/student/fetch/placement",[StudentPlacementsController::class,'fetch']);
    Route::post("/student/update/placement",[StudentPlacementsController::class,'update']);
    Route::post("/student/delete/placement",[StudentPlacementsController::class,'destroy']);
    Route::get("/student/fetch/placement/{id}",[StudentPlacementsController::class,'fetch_placement_by_id']);

});

Route::middleware(['auth:sanctum','verified', 'ability:token-admin'])->group(function () {
    Route::post('/update/profile',[ProfileController::class,'update']);
    Route::get("/admin/fetch/students",[StudentController::class,"index"]);
    Route::get("/admin/fetch/student/internship",[StudentController::class,'fetch_internship_by_student_id']);
    Route::get("/admin/fetch/student/ecc",[StudentController::class,'fetch_ecc_by_student_id']);
    Route::get("/admin/fetch/student/achievements",[StudentController::class,'fetch_achievements_by_student_id']);
    Route::get("/admin/fetch/student/hackathons",[StudentController::class,'fetch_hackathons_by_student_id']);
    Route::get("/admin/fetch/student/higher-studies",[StudentController::class,'fetch_higherstudies_by_student_id']);
    Route::get("/admin/fetch/student/placements",[StudentController::class,'fetch_placements_by_student_id']);


    Route::get("/admin/fetch/student/{id}",[StudentController::class,"fetch_student"]);
    Route::get("/admin/fetch/internship/{id}",[StudentController::class,"fetch_internship"]);
    Route::get("/admin/fetch/ecc/{id}",[StudentController::class,'fetch_ecc']);
    Route::get("/admin/fetch/achievement/{id}",[StudentController::class,'fetch_achievement']);
    Route::get("/admin/fetch/hackathon/{id}",[StudentController::class,'fetch_hackathon']);
    Route::get("/admin/fetch/higher-study/{id}",[StudentController::class,'fetch_hs']);
    Route::get("/admin/fetch/placement/{id}",[StudentController::class,'fetch_placement']);


    Route::post("/admin/update/student",[StudentController::class,'update_student']);
    Route::post("/admin/update/internship",[StudentController::class,'update_internship']);
    Route::post("/admin/update/achievement",[StudentController::class,'update_achievement']);
    Route::post("/admin/update/extra-curricular-activities",[StudentController::class,'update_ecc']);
    Route::post("/admin/update/hackathon",[StudentController::class,'update_hackathon']);
    Route::post("/admin/update/higher-studies",[StudentController::class,'update_higher_studies']);
    Route::post("/admin/update/placement",[StudentController::class,'update_placement']);

});

Route::middleware(['auth:sanctum','verified', 'ability:token-student,token-admin'])->group(function () {
    Route::post('/update/profile',[ProfileController::class,'update']);
    Route::get('/fetch/profile', function (Request $request) {
        return $request->user();
    });
});


require __DIR__.'/auth.php';
