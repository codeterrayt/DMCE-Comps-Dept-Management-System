<?php

namespace App\Http\Controllers;

use App\Models\AssignedSubject;
use App\Models\Student;
use App\Models\StudentAttendance;
use App\Models\Subjects;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use PhpOption\None;
use Illuminate\Support\Facades\DB;

class StudentAttendanceController extends Controller
{
    public function index(Request $request)
    {

        $request->validate([
            "subject_id" => 'required|integer|exists:subjects,id'
        ]);

        $subject_id = $request->subject_id;

        $current_subject = Subjects::where("id",$subject_id)->first();

        // dd($subject_sem->subject_sem);

        $data = Student::with(['attendances' => function ($query) use ($subject_id) {
            $query->where('subject_id', $subject_id);
        }])->where("sem",$current_subject->subject_sem)->get();


        // dd($subject_sem);
        // $data = Student::where("sem",$current_subject->subject_sem)->get();


        // if(count($data) == 0){
        // $subject = Subjects::find($subject_id);
        // dd($subject);
        // $data = Student::with('attendances')->where("sem",$subject->subject_sem)->get();
        // }

        return response()->json($data);





        //     $data = DB::table('professors')
        //     ->join('assigned_subjects', 'professors.user_id', '=', 'assigned_subjects.user_id')
        //     ->join('students', function ($join) {
        //         $join->on('assigned_subjects.sem', '=', 'students.sem');
        //     })
        //     ->join('student_attendances', function ($join) {//////
        //         $join->on('assigned_subjects.sem', '=', 'student_attendances.sem');
        //     })
        //     ->select(
        //         'professors.*',  // Select columns from professors table
        //         'assigned_subjects.*',  // Select columns from assigned_subjects table
        //         'students.*',  // Select columns from students table
        //         'student_attendances.*'  // Select columns from student_attendances table
        //     )
        //     ->get();

        // return response()->json($data);

    }


    public function index_pr(Request $request)
    {

        $request->validate([
            "subject_id" => 'required|integer|exists:subjects,id',
            "sub_batch" => "required|string|exists:sub_batches,sub_batch",
            "academic_year" => "required|string"
        ]);

        $subject_id = $request->subject_id;
        $sub_batch = $request->sub_batch;
        $academic_year = $request->academic_year;

        $current_subject = Subjects::where("id",$subject_id)->first();

        // dd($subject_sem->subject_sem);

        $data = Student::with(['attendances' => function ($query) use ($subject_id) {
            $query->where('subject_id', $subject_id)
            // ->where("pr_th",0)
            ;
        }])->where("sem",$current_subject->subject_sem)->where("batch",$sub_batch)->where("academic_year",$academic_year)->get();

        return response()->json($data);


    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,student_id',
            'sem' => 'required|integer',
            'academic_year' => 'required|string',
            'course_year' => 'required|string',
            'pr_th' => 'required|boolean',
            'subject_id' => 'required|exists:subjects,id',
            'm1' => 'integer|nullable',
            'm2' => 'integer|nullable',
            'm3' => 'integer|nullable',
            'm4' => 'integer|nullable',
            'total' => 'integer|nullable',
        ]);

        $d = StudentAttendance::where([
            ["sem", "=", $request->sem],
            ["student_id", "=", $request->student_id],
            ["academic_year", "=", $request->academic_year],
            ["pr_th", "=", $request->pr_th],
            ["subject_id", "=", $request->subject_id],
        ])->first();

        if ($d) {
            return response()->json(['message' => 'Data Already Exits'], 404);
        }

        // Calculate the total
        $total = ($request->m1 ?? 0) + ($request->m2 ?? 0) + ($request->m3 ?? 0) + ($request->m4 ?? 0);

        // Merge the total into the request data
        $data = $request->all();
        $data['total'] = $total;

        // Create the attendance record
        $attendance = StudentAttendance::create($data);
        return response()->json($attendance, 201);
    }


    public function show($id)
    {
        $attendance = StudentAttendance::with('student', 'subject')->find($id);
        if (!$attendance) {
            return response()->json(['message' => 'Student not found'], 404);
        }
        return response()->json($attendance);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'student_id' => 'required|exists:students,student_id',
            'sem' => 'required|integer',
            'academic_year' => 'required|string',
            'course_year' => 'required|string',
            'pr_th' => 'required|boolean',
            'subject_id' => 'required|exists:subjects,id',
            'm1' => 'integer|nullable',
            'm2' => 'integer|nullable',
            'm3' => 'integer|nullable',
            'm4' => 'integer|nullable',
            'total' => 'integer|nullable',
        ]);

        $attendance = StudentAttendance::find($id);

        if ($attendance == null) {
            return response()->json(['message' => 'Data not found'], 404);
        }
        
        // Update the attendance record with the request data
        $attendance->update($request->all());
        
        // Calculate the total
        $total = ($request->m1 ?? $attendance->m1) 
               + ($request->m2 ?? $attendance->m2) 
               + ($request->m3 ?? $attendance->m3) 
               + ($request->m4 ?? $attendance->m4);
        
        // Update the total in the attendance record
        $attendance->total = $total;
        $attendance->save();
        
        return response()->json($attendance);

        // Find the attendance record by ID
        // $attendance = StudentAttendance::find($id);

        // if ($attendance == null) {
        //     return response()->json(['message' => 'Data not found'], 404);
        // }

        // // Update the attendance record with the request data
        // $attendance->update($request->all());

        // // Calculate the total
        // $total = ($request->m1 ?? 0) + ($request->m2 ?? 0) + ($request->m3 ?? 0) + ($request->m4 ?? 0);

        // // Update the total in the attendance record
        // $attendance->total = $total;
        // $attendance->save();

        // return response()->json($attendance);
    }

    public function monthwise_attendance(Request $request)
    {
        $request->validate([
            'academic_year' => 'required|string',
            'sem' => 'required|string|in:1,2,3,4,5,6,7,8',
            'batch' => 'required'
        ]);

        $academic_year = $request->academic_year;
        $subjectSem = $request->sem;
        $batch = $request->batch;

        // $data = Student::with(['attendances' => function ($query) use ($subjectSem, $academic_year) {
        //     $query->where('sem', $subjectSem)->where("academic_year",$academic_year);
        // }])->where("sem",$subjectSem)->get();


        $data = Student::with(['attendances' => function ($query) use ($subjectSem, $academic_year,$batch) {
            $query->where('sem', $subjectSem)->where("academic_year",$academic_year);
            // ->where("pr_th",0)
            ;
        }])->where("sem",$subjectSem)->where("academic_year",$academic_year)->where("batch","like","{$batch}%")->get();



        return response()->json($data);
    }



    // public function destroy($id)
    // {
    //     $attendance = StudentAttendance::find($id);

    //     if(!$attendance){
    //         return response()->json(['message' => 'Student not found'], 404);
    //     }

    //     $attendance->delete();
    //     return response()->json(['message' => 'Student not found'], 204);
    // }
}
