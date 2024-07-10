<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentHigherStudies;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class StudentHigherStudiesController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'student_academic_year' => 'required|string|max:255',
            'student_exam_type' => 'required|string|max:255',
            'student_score' => 'required|string|max:255',
            'university_city' => 'required|string|max:255',
            'university_state' => 'required|string|max:255',
            'university_country' => 'required|string|max:255',
            'university_name' => 'required|string|max:255',
            'student_course' => 'required|string|max:255',
            'student_admission_letter' => 'required|file|mimes:jpeg,jpg,png,pdf|max:512',
            'student_project_guide' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Create a new StudentHigherStudies instance
        $StudentHigherStudies = new StudentHigherStudies();

        // Fill the StudentHigherStudies attributes from the request data
        $StudentHigherStudies->fill($request->all());

        if ($request->hasFile('student_admission_letter')) {
            // dd("test");
            $student_admission_letter = $request->file('student_admission_letter')->store('student_admission_letters', 'public');
            $StudentHigherStudies->student_admission_letter = url()->to(Storage::url($student_admission_letter));
        }

        // Associate the StudentHigherStudies with the authenticated user
        $StudentHigherStudies->user_id = auth()->id();

        // Save the StudentHigherStudies
        $StudentHigherStudies->save();

        // Return a response
        return response()->json(['message' => 'Higher Studies added successfully', 'exam_score' => $StudentHigherStudies]);
    }

    public function update(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'id' => [
                'required',
                Rule::exists('student_higher_studies')->where(function ($query) {
                    return $query->where('id', request()->id)
                                 ->where('user_id', auth()->id());
                }),
            ],
            'student_academic_year' => 'required|string|max:255',
            'student_exam_type' => 'required|string|max:255',
            'student_score' => 'required|string|max:255',
            'university_city' => 'required|string|max:255',
            'university_state' => 'required|string|max:255',
            'university_country' => 'required|string|max:255',
            'university_name' => 'required|string|max:255',
            'student_course' => 'required|string|max:255',
            'student_admission_letter' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:512',
            'student_project_guide' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        // Find the StudentHigherStudies by ID
        $StudentHigherStudies = StudentHigherStudies::findOrFail($request->id);

        // Check if the authenticated user owns the exam score

        // Update the StudentHigherStudies attributes from the request data
        $StudentHigherStudies->fill($request->all());

        if ($request->hasFile('student_admission_letter')) {
            // dd("test");
            $student_admission_letter = $request->file('student_admission_letter')->store('student_admission_letters', 'public');
            $StudentHigherStudies->student_admission_letter = url()->to(Storage::url($student_admission_letter));
        }

        // Save the StudentHigherStudies
        $StudentHigherStudies->save();

        // Return a response
        return response()->json(['message' => 'Higher Studies updated successfully', 'exam_score' => $StudentHigherStudies]);
    }

    public function fetch(Request $request){
   // Retrieve the authenticated user
        $user = Auth::user();

        // Call fetch_internships() on the authenticated user
        $fetch_higher_studies = $user->fetch_higher_studies();

        // Return a response
        return response()->json(['higher_studies' => $fetch_higher_studies]);
    }

    public function fetch_hs_by_id($id){
        $user = Auth::user();
        $student_internship = StudentHigherStudies::where("user_id",$user->id)->where("id",$id)->first();
        // Get the currently authenticated user

        if($student_internship === null){
            return response()->json([
                "message" => "Higher Study Not Found"
            ], 404);
        }
        return response()->json($student_internship);
    }

    public function destroy(Request $request)
    {

        $request->validate([
            'id' => [
                'required',
                Rule::exists('student_higher_studies')->where(function ($query) {
                    return $query->where('id', request()->id)
                                 ->where('user_id', auth()->id());
                }),
            ],
        ]);

        // Find the job placement by ID
        $jobPlacement = StudentHigherStudies::findOrFail($request->id);

        // Delete the job placement
        $jobPlacement->delete();

        // Return a response
        return response()->json(['message' => 'Higher Studies deleted successfully']);
    }

}
