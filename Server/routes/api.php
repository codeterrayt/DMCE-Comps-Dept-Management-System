<?php

use App\Http\Controllers\AssignedSubjectController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentAchivementsController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentExtraCuController;
use App\Http\Controllers\StudentHackathonsController;
use App\Http\Controllers\StudentHigherStudiesController;
use App\Http\Controllers\StudentInternshipController;
use App\Http\Controllers\StudentPlacementsController;
use App\Http\Controllers\SubBatchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ProfessorController;
use App\Http\Controllers\UniversalStudentController;
use App\Http\Controllers\StudentAttendanceController;

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



Route::middleware(['auth:sanctum', 'verified', 'ability:token-student'])->group(function () {
    Route::post("/student/add/internship", [StudentInternshipController::class, 'store']);
    Route::get("/student/fetch/internships", [StudentInternshipController::class, 'fetch']);
    Route::post("/student/update/internship", [StudentInternshipController::class, 'update']);
    Route::post("/student/delete/internship", [StudentInternshipController::class, 'destroy']);
    Route::get("/student/fetch/internship/{id}", [StudentInternshipController::class, 'fetchInternshipByID']);

    Route::post("/student/add/achievement", [StudentAchivementsController::class, 'store']);
    Route::get("/student/fetch/achievements", [StudentAchivementsController::class, 'fetch']);
    Route::post("/student/update/achievement", [StudentAchivementsController::class, 'update']);
    Route::post("/student/delete/achievement", [StudentAchivementsController::class, 'destroy']);
    Route::get("/student/fetch/achievement/{id}", [StudentAchivementsController::class, 'fetchAchivementByID']);

    Route::post("/student/add/extra-curricular-activities", [StudentExtraCuController::class, 'store']);
    Route::get("/student/fetch/extra-curricular-activities", [StudentExtraCuController::class, 'fetch']);
    Route::post("/student/update/extra-curricular-activities", [StudentExtraCuController::class, 'update']);
    Route::post("/student/delete/extra-curricular-activities", [StudentExtraCuController::class, 'destroy']);
    Route::get("/student/fetch/extra-curricular-activities/{id}", [StudentExtraCuController::class, 'fetchEccById']);

    Route::post("/student/add/hackathon", [StudentHackathonsController::class, 'store']);
    Route::get("/student/fetch/hackathon", [StudentHackathonsController::class, 'fetch']);
    Route::post("/student/update/hackathon", [StudentHackathonsController::class, 'update']);
    Route::post("/student/delete/hackathon", [StudentHackathonsController::class, 'destroy']);
    Route::get("/student/fetch/hackathon/{id}", [StudentHackathonsController::class, 'fetch_hackathon_by_id']);

    Route::post("/student/add/higher-studies", [StudentHigherStudiesController::class, 'store']);
    Route::get("/student/fetch/higher-studies", [StudentHigherStudiesController::class, 'fetch']);
    Route::post("/student/update/higher-studies", [StudentHigherStudiesController::class, 'update']);
    Route::post("/student/delete/higher-studies", [StudentHigherStudiesController::class, 'destroy']);
    Route::get("/student/fetch/higher-studies/{id}", [StudentHigherStudiesController::class, 'fetch_hs_by_id']);

    Route::post("/student/add/placement", [StudentPlacementsController::class, 'store']);
    Route::get("/student/fetch/placement", [StudentPlacementsController::class, 'fetch']);
    Route::post("/student/update/placement", [StudentPlacementsController::class, 'update']);
    Route::post("/student/delete/placement", [StudentPlacementsController::class, 'destroy']);
    Route::get("/student/fetch/placement/{id}", [StudentPlacementsController::class, 'fetch_placement_by_id']);

    Route::post("/student/update/password", [ProfileController::class, 'update_password']);
});

Route::middleware(['auth:sanctum', 'verified', 'ability:token-admin'])->group(function () {
    // Route::post('/update/profile',[ProfileController::class,'update']);
    Route::get("/admin/fetch/students", [StudentController::class, "index"]);
    Route::get("/admin/fetch/student/internship", [StudentController::class, 'fetch_internship_by_student_id']);
    Route::get("/admin/fetch/student/ecc", [StudentController::class, 'fetch_ecc_by_student_id']);
    Route::get("/admin/fetch/student/achievements", [StudentController::class, 'fetch_achievements_by_student_id']);
    Route::get("/admin/fetch/student/hackathons", [StudentController::class, 'fetch_hackathons_by_student_id']);
    Route::get("/admin/fetch/student/higher-studies", [StudentController::class, 'fetch_higherstudies_by_student_id']);
    Route::get("/admin/fetch/student/placements", [StudentController::class, 'fetch_placements_by_student_id']);


    Route::get("/admin/fetch/student/{id}", [StudentController::class, "fetch_student"]);
    Route::get("/admin/fetch/internship/{id}", [StudentController::class, "fetch_internship"]);
    Route::get("/admin/fetch/ecc/{id}", [StudentController::class, 'fetch_ecc']);
    Route::get("/admin/fetch/achievement/{id}", [StudentController::class, 'fetch_achievement']);
    Route::get("/admin/fetch/hackathon/{id}", [StudentController::class, 'fetch_hackathon']);
    Route::get("/admin/fetch/higher-study/{id}", [StudentController::class, 'fetch_hs']);
    Route::get("/admin/fetch/placement/{id}", [StudentController::class, 'fetch_placement']);


    Route::post("/admin/update/student", [StudentController::class, 'update_student']);
    Route::post("/admin/update/password", [StudentController::class, 'update_password']);
    Route::post("/admin/update/internship", [StudentController::class, 'update_internship']);
    Route::post("/admin/update/achievement", [StudentController::class, 'update_achievement']);
    Route::post("/admin/update/extra-curricular-activities", [StudentController::class, 'update_ecc']);
    Route::post("/admin/update/hackathon", [StudentController::class, 'update_hackathon']);
    Route::post("/admin/update/higher-studies", [StudentController::class, 'update_higher_studies']);
    Route::post("/admin/update/placement", [StudentController::class, 'update_placement']);


    Route::post('/admin/add/batch', [BatchController::class, 'store']);
    Route::post('/admin/delete/batch/{id}', [BatchController::class, 'destroy']);
    Route::post('/admin/update/batch/{id}', [BatchController::class, 'update']);
    Route::get('/admin/fetch/batches', [BatchController::class, 'index']);


    Route::post('/admin/add/sub_batch', [SubBatchController::class, 'store']);
    Route::post('/admin/delete/sub_batch/{id}', [SubBatchController::class, 'destroy']);
    Route::post('/admin/update/sub_batch/{id}', [SubBatchController::class, 'update']);
    Route::get('/admin/fetch/sub_batches', [SubBatchController::class, 'index']);


    Route::get('/admin/fetch/subjects', [SubjectController::class, 'index']);
    Route::post('/admin/add/subject', [SubjectController::class, 'store']);
    Route::get('/admin/fetch/subject/{id}', [SubjectController::class, 'show']);
    Route::post('/admin/update/subject/{id}', [SubjectController::class, 'update']);
    Route::post('/admin/delete/subject/{id}', [SubjectController::class, 'destroy']);


    Route::get('/admin/fetch/professors', [ProfessorController::class, 'index']);
    Route::post('/admin/add/professor', [ProfessorController::class, 'store']);
    Route::get('/admin/fetch/professor/{id}', [ProfessorController::class, 'show']);
    Route::post('/admin/update/professor/{id}', [ProfessorController::class, 'update']);
    Route::post('/admin/delete/professor/{id}', [ProfessorController::class, 'destroy']);

    Route::get('/admin/fetch/assigned-subjects', [AssignedSubjectController::class, 'index']);
    Route::post('/admin/add/assigned-subject', [AssignedSubjectController::class, 'store']);
    Route::get('/admin/fetch/assigned-subject/{id}', [AssignedSubjectController::class, 'show']);
    Route::post('/admin/update/assigned-subject/{id}', [AssignedSubjectController::class, 'update']);
    Route::post('/admin/delete/assigned-subject/{id}', [AssignedSubjectController::class, 'destroy']);

    Route::get('/admin/fetch/csv/students', [UniversalStudentController::class, 'index']);
    Route::post('/admin/add/csv/student', [UniversalStudentController::class, 'store']);
    Route::get('/admin/fetch/csv/student/{id}', [UniversalStudentController::class, 'show']);
    Route::post('/admin/update/csv/student/{id}', [UniversalStudentController::class, 'update']);
    Route::post('/admin/delete/csv/student/{id}', [UniversalStudentController::class, 'destroy']);
    Route::post('/admin/upload/csv/students', [UniversalStudentController::class, 'upload']);

});


Route::middleware(['auth:sanctum', 'verified', 'ability:token-professor,token-admin'])->group(function () {
    Route::get('/ap/fetch/student-attendances', [StudentAttendanceController::class, 'index']);
    Route::get('/ap/fetch/pr/student-attendances', [StudentAttendanceController::class, 'index_pr']);
    Route::post('/ap/add/student-attendance', [StudentAttendanceController::class, 'store']);
    Route::get('/ap/fetch/student-attendance/{id}', [StudentAttendanceController::class, 'show']);
    Route::post('/ap/update/student-attendance/{id}', [StudentAttendanceController::class, 'update']);
    // Route::post('/ap/delete/student-attendance/{id}', [StudentAttendanceController::class, 'destroy']);

    Route::get('/ap/fetch/student/month-wise-attendance', [StudentAttendanceController::class, 'monthwise_attendance']);

});



Route::middleware(['auth:sanctum', 'verified', 'ability:token-professor'])->group(function () {
    Route::get('/professor/fetch/assigned-subjects', [AssignedSubjectController::class, 'fetch_loggedin_professor_assigned_subject']);
});

Route::middleware(['auth:sanctum', 'verified', 'ability:token-student,token-admin,token-professor'])->group(function () {
    Route::post('/update/profile', [ProfileController::class, 'update']);
    Route::get('/fetch/profile', function (Request $request) {
        return $request->user();
    });
});


require __DIR__ . '/auth.php';
