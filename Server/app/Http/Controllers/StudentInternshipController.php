<?php

namespace App\Http\Controllers;

use App\Models\StudentInternship;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class StudentInternshipController extends Controller
{
    //


    /**
     * Store a newly created internship record in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'academic_year' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'duration' => 'required|integer|max:255',
            'domain' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'completion_letter_path' => 'required|file|mimes:jpeg,jpg,png,pdf|max:512',
            'certificate_path' => 'required|file|mimes:jpeg,jpg,png,pdf|max:512',
            'offer_letter_path' => 'required|file|mimes:jpeg,jpg,png,pdf|max:512',
            'permission_letter_path' => 'required|file|mimes:jpeg,jpg,png,pdf|max:512',
            'student_year' => 'required|string|max:255',
            // Add validation rules for other internship attributes here
        ]);

        // Create a new internship instance
        $internship = new StudentInternship();

        // Move and store each uploaded file in its respective directory
        $completionLetterPath = $request->file('completion_letter_path')->store('completion_letter', 'public');
        $certificatePath = $request->file('certificate_path')->store('internship_certificate', 'public');
        $offerLetterPath = $request->file('offer_letter_path')->store('internship_offer_letter', 'public');
        $permissionLetterPath = $request->file('permission_letter_path')->store('internship_permission_letter', 'public');


        // Fill the internship attributes from the request data
        $internship->fill($request->all());

        $internship->start_date = date('Y-m-d', strtotime($request->start_date));
        $internship->end_date = date('Y-m-d', strtotime($request->end_date));
        $internship->completion_letter_path = url()->to(Storage::url($completionLetterPath));
        $internship->certificate_path = url()->to(Storage::url($certificatePath));
        $internship->offer_letter_path = url()->to(Storage::url($offerLetterPath));
        $internship->permission_letter_path = url()->to(Storage::url($permissionLetterPath));

        // Set the user_id to the current authenticated user's ID
        $internship->user_id = Auth::id();

        // Save the internship
        $internship->save();

        // Return a response
        return response()->json(['message' => 'Internship created successfully', 'internship' => $internship], 201);
    }

    /**
     * Update the specified internship record in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        // Validate the incoming request data
        // Validate the incoming request data
        $request->validate([
            'id' => [
                'required',
                Rule::exists('student_internships')->where(function ($query) {
                    return $query->where('id', request()->id)
                        ->where('user_id', auth()->id());
                }),
            ],
            'academic_year' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'duration' => 'required|integer|max:255',
            'domain' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'completion_letter_path' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:512',
            'certificate_path' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:512',
            'offer_letter_path' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:512',
            'permission_letter_path' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:512',
            'student_year' => 'required|string|max:255',
            // Add validation rules for other internship attributes here
        ]);

        // Find the internship by ID
        $internship = StudentInternship::findOrFail($request->id);

        // Update the internship attributes if the corresponding file exists in the request

        if ($request->hasFile('completion_letter_path')) {
            // dd("test");
            $certificatePath = $request->file('completion_letter_path')->store('completion_letter', 'public');
            $internship->completion_letter_path = url()->to(Storage::url($certificatePath));
        }

        if ($request->hasFile('certificate_path')) {
            $certificatePath = $request->file('certificate_path')->store('internship_certificate', 'public');
            $internship->certificate_path = url()->to(Storage::url($certificatePath));
        }

        if ($request->hasFile('offer_letter_path')) {
            $offerLetterPath = $request->file('offer_letter_path')->store('internship_offer_letter', 'public');
            $internship->offer_letter_path = url()->to(Storage::url($offerLetterPath));
        }

        if ($request->hasFile('permission_letter_path')) {
            $permissionLetterPath = $request->file('permission_letter_path')->store('internship_permission_letter', 'public');
            $internship->permission_letter_path = url()->to(Storage::url($permissionLetterPath));
        }

        // Fill the other internship attributes from the request data
        $internship->fill($request->except(['certificate_path', 'offer_letter_path', 'permission_letter_path', 'completion_letter_path']));
        $internship->start_date = date('Y-m-d', strtotime($request->start_date));
        $internship->end_date = date('Y-m-d', strtotime($request->end_date));



        // Save the internship
        $internship->save();

        // Return a response
        return response()->json(['message' => 'Internship updated successfully', 'internship' => $internship]);
    }

    public function fetch(Request $request)
    {
        // Retrieve the authenticated user
        $user = Auth::user();

        // Call fetch_internships() on the authenticated user
        $internships = $user->fetch_internships();

        // Return the internships as a JSON response
        return response()->json(["internships" => $internships]);
    }

    public function fetchInternshipByID($id)
    {
        $user = Auth::user();
        $student_internship = StudentInternship::where("user_id",$user->id)->where("id",$id)->first();
        // Get the currently authenticated user

        if($student_internship === null){
            return response()->json([
                "message" => "Internship Not Found"
            ], 404);
        }
        return response()->json($student_internship);

    }

    public function destroy(Request $request)
    {

        $request->validate([
            'id' => [
                'required',
                Rule::exists('student_internships')->where(function ($query) {
                    return $query->where('id', request()->id)
                        ->where('user_id', auth()->id());
                }),
            ],
        ]);

        // Find the job placement by ID
        $jobPlacement = StudentInternship::findOrFail($request->id);

        // Delete the job placement
        $jobPlacement->delete();

        // Return a response
        return response()->json(['message' => 'Internship deleted successfully']);
    }
}
