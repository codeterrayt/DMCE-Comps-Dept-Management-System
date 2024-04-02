<?php

namespace App\Http\Controllers;

use App\Models\StudentAchivements;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class StudentAchivementsController extends Controller
{

    public function fetch(Request $request){
          // Retrieve the authenticated user
          $user = Auth::user();

          // Call fetch_internships() on the authenticated user
          $achievements = $user->fetch_achievements();

          // Return the internships as a JSON response
          return response()->json(["achievements" => $achievements]);
    }

    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'academic_year' => 'required|string|max:255',
            'student_year' => 'required|string|max:255',
            'achievement_certificate_path' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:512',
            'achievement_domain' => 'required|string|max:255',
            'college_name' => 'required|string|max:255',
            'achievement_level' => 'required|string|max:255',
            'achievement_location' => 'required|string|max:255',
            'achievement_date' => 'required|date',
            'prize' => 'nullable|string|max:255',
        ]);

        // Create a new Achievement instance
        $achievement = new StudentAchivements();

        // Fill the Achievement attributes from the request data
        $achievement->fill($request->all());

        if ($request->hasFile('achievement_certificate_path')) {
            // dd("test");
            $certificatePath = $request->file('achievement_certificate_path')->store('achievement_certificate', 'public');
            $achievement->achievement_certificate_path = url()->to(Storage::url($certificatePath));
        }

        // Associate the Achievement with the authenticated user
        $achievement->achievement_date = date('Y-m-d', strtotime($request->achievement_date));
        $achievement->user_id = auth()->id();

        // Save the Achievement
        $achievement->save();

        // Return a response
        return response()->json(['message' => 'Achievement stored successfully', 'achievement' => $achievement]);
    }

    public function update(Request $request)
    {
        // Validate the incoming request data
         // Validate the incoming request data
         $request->validate([
            'id' => [
                'required',
                Rule::exists('student_achievements')->where(function ($query) {
                    return $query->where('id', request()->id)
                                 ->where('user_id', auth()->id());
                }),
            ],
            'academic_year' => 'required|string|max:255',
            'student_year' => 'required|string|max:255',
            'achievement_certificate_path' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:512',
            'achievement_domain' => 'required|string|max:255',
            'college_name' => 'required|string|max:255',
            'achievement_level' => 'required|string|max:255',
            'achievement_location' => 'required|string|max:255',
            'achievement_date' => 'required|date',
            'prize' => 'nullable|string|max:255',
            // Add validation rules for other internship attributes here
        ]);

        // Find the internship by ID
        $achievement = StudentAchivements::findOrFail($request->id);

        // Update the internship attributes if the corresponding file exists in the request

        $achievement->fill($request->all());

        if ($request->hasFile('achievement_certificate_path')) {
            // dd("test");
            $certificatePath = $request->file('achievement_certificate_path')->store('achievement_certificate', 'public');
            $achievement->achievement_certificate_path = url()->to(Storage::url($certificatePath));
        }

        // Associate the Achievement with the authenticated user
        $achievement->achievement_date = date('Y-m-d', strtotime($request->achievement_date));
        $achievement->user_id = auth()->id();

        // Save the Achievement
        $achievement->save();
        // Return a response
        return response()->json(['message' => 'Internship updated successfully', 'internship' => $achievement]);
    }

}
