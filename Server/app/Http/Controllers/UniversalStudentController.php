<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UniversalStudentController extends Controller
{
    //
    public function index()
    {
        $students = Student::with('user')->get();
        return response()->json($students);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|string|max:255|unique:students,student_id',
            'roll_no' => 'required|integer|max:255',
            'name' => 'required|string|max:255',
            'batch' => 'required|string',
            'academic_year' => 'required|string',
            'course_year' => 'required|string',
            'sem' => 'required|string',
        ]);

        $student = new Student();
        $student->student_id = $request->student_id;
        $student->roll_no = $request->roll_no;
        $student->name = $request->name;
        $student->batch = $request->batch;
        $student->save();


        // $user = new User();
        // $user->name = $request->name;
        // $user->email = $request->email;
        // $user->password = Hash::make($request->password);
        // $user->student_id = $request->student_id;
        // $user->save();

        return response()->json($student->load('user'), 201);
    }

    public function show($id)
    {
        $student = Student::with('user')->find($id);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        return response()->json($student);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'student_id' => 'required|string|max:255|unique:students,student_id,' . $id,
            'roll_no' => 'required|integer',
            'name' => 'required|string|max:255',
            'batch' => 'required|string',
            'academic_year' => 'required|string',
            'course_year' => 'required|string',
            'sem' => 'required|string',
        ]);

        $student = Student::find($id);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $student->student_id = $request->student_id;
        $student->roll_no = $request->roll_no;
        $student->name = $request->name;
        $student->batch = $request->batch;
        $student->save();

        // $user = User::where('student_id', $student->student_id)->first();
        // if ($user) {
        //     $user->name = $request->name;
        //     $user->email = $request->email;
        //     if ($request->password) {
        //         $user->password = Hash::make($request->password);
        //     }
        //     $user->save();
        // } else {
        //     $user = new User();
        //     $user->name = $request->name;
        //     $user->email = $request->email;
        //     $user->password = Hash::make($request->password);
        //     $user->student_id = $request->student_id;
        //     $user->save();
        // }

        return response()->json($student->load('user'));
    }

    public function destroy($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        // $user = User::where('student_id', $student->student_id)->first();
        // if ($user) {
        //     $user->delete();
        // }

        $student->delete();

        return response()->json(['message' => 'Student deleted successfully']);
    }


    // public function upload(Request $request)
    // {
    //     $request->validate([
    //         'file' => 'required|mimes:csv,txt',
    //     ]);

    //     $file = $request->file('file');
    //     $handle = fopen($file, 'r');
    //     $header = true;

    //     while (($row = fgetcsv($handle, 1000, ',')) !== FALSE) {
    //         if ($header) {
    //             $header = false;
    //             continue;
    //         }

    //         $student = Student::create([
    //             'student_id' => $row[0],
    //             'roll_no' => $row[1],
    //             'name' => $row[2],
    //             'batch_id' => $row[3],
    //         ]);

    //         User::create([
    //             'name' => $row[2],
    //             'email' => $row[4],
    //             'password' => Hash::make($row[5]),
    //             'student_id' => $row[0],
    //         ]);
    //     }

    //     fclose($handle);

    //     return response()->json(['message' => 'Students uploaded successfully']);
    // }



    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
            'academic_year' => 'required|string',
            'course_year' => 'required|string',
            'sem' => 'required|string',
        ]);

        $file = $request->file('file');
        $handle = fopen($file, 'r');
        $header = true;

        $students = [];
        $errorRows = [];

        DB::beginTransaction();

        try {
            // Extract headers
            $headers = fgetcsv($handle, 1000, ',');
            $headerMap = array_map('strtolower',$headers);
            $headerMap = array_flip($headerMap);


            while (($row = fgetcsv($handle, 1000, ',')) !== FALSE) {

                // Validate the data
                $validator = Validator::make([
                    'student_id' => $row[$headerMap['student id']],
                    'roll_no' => $row[$headerMap['roll no']],
                    'name' => $row[$headerMap['name of the students']],
                    'batch' => $row[$headerMap['batch']],
                ], [
                    'student_id' => 'required|string|max:255|unique:students,student_id',
                    'roll_no' => 'required|integer',
                    'name' => 'required|string|max:255',
                    'batch' => 'required|string',
                ]);

                if ($validator->fails()) {
                    $errorRows[] = $row;
                    continue;
                }

                // Prepare the student and user data
                $students[] = [
                    'student_id' => $row[$headerMap['student id']],
                    'roll_no' => $row[$headerMap['roll no']],
                    'name' => $row[$headerMap['name of the students']],
                    'batch' => $row[$headerMap['batch']],
                    'academic_year' => $request->academic_year,
                    'course_year' =>  $request->course_year,
                    'sem' =>  $request->sem,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];


            }

            // Batch insert the data
            Student::insert($students);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            fclose($handle);
            return response()->json(['message' => 'Error processing file', 'error' => $e->getMessage()], 500);
        }

        fclose($handle);

        if (count($errorRows) > 0) {
            return response()->json(['message' => 'File processed with errors', 'error_rows' => $errorRows], 400);
        }

        return response()->json(['message' => 'Students uploaded successfully']);
    }
}
