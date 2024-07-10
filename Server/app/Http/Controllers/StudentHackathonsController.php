<?php

namespace App\Http\Controllers;

use App\Models\StudentHackathons;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class StudentHackathonsController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'academic_year' => 'required|string|max:255',
            'student_year' => 'required|string|max:255',
            'hackathon_title' => 'required|string|max:255',
            'hackathon_level' => 'required|string|max:255',
            'hackathon_location' => 'required|string|max:255',
            'hackathon_from_date' => 'required|date',
            'hackathon_to_date' => 'required|date|after_or_equal:hackathon_from_date',
            'hackathon_prize' => 'nullable|string|max:255',
            'hackathon_position' => 'nullable|string|max:255',
            'hackathon_college_name' => 'required|string|max:255',
            'hackathon_certificate_path' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:512',
            'description' => 'nullable|string',
        ]);

        // Create a new StudentHackathons instance
        $StudentHackathons = new StudentHackathons();

        // Fill the StudentHackathons attributes from the request data
        $StudentHackathons->fill($request->all());

        if ($request->hasFile('hackathon_certificate_path')) {
            // dd("test");
            $hackathon_certificate_path = $request->file('hackathon_certificate_path')->store('hackathon_certificates', 'public');
            $StudentHackathons->hackathon_certificate_path = url()->to(Storage::url($hackathon_certificate_path));
        }

        // Associate the StudentHackathons with the authenticated user
        $StudentHackathons->user_id = auth()->id();
        $StudentHackathons->hackathon_from_date = date('Y-m-d', strtotime($request->hackathon_from_date));
        $StudentHackathons->hackathon_to_date = date('Y-m-d', strtotime($request->hackathon_to_date));

        // Save the StudentHackathons
        $StudentHackathons->save();

        // Return a response
        return response()->json(['message' => 'Hackathon participation stored successfully', 'hackathon_participation' => $StudentHackathons]);
    }

    public function fetch()
    {
         // Retrieve the authenticated user
         $user = Auth::user();

         // Call fetch_internships() on the authenticated user
         $StudentHackathonss = $user->fetch_hackathons();

        // Return a response
        return response()->json(['hackathon_participations' => $StudentHackathonss]);
    }

    public function fetch_hackathon_by_id($id){
        $user = Auth::user();
        $student_internship = StudentHackathons::where("user_id",$user->id)->where("id",$id)->first();
        // Get the currently authenticated user

        if($student_internship === null){
            return response()->json([
                "message" => "Hackathon Not Found"
            ], 404);
        }
        return response()->json($student_internship);
    }

    public function update(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'id' => [
                'required',
                Rule::exists('student_hackathons')->where(function ($query) {
                    return $query->where('id', request()->id)
                                 ->where('user_id', auth()->id());
                }),
            ],
            'academic_year' => 'required|string|max:255',
            'student_year' => 'required|string|max:255',
            'hackathon_title' => 'required|string|max:255',
            'hackathon_level' => 'required|string|max:255',
            'hackathon_location' => 'required|string|max:255',
            'hackathon_from_date' => 'required|date',
            'hackathon_to_date' => 'required|date|after_or_equal:hackathon_from_date',
            'hackathon_prize' => 'nullable|string|max:255',
            'hackathon_position' => 'nullable|string|max:255',
            'hackathon_college_name' => 'required|string|max:255',
            'hackathon_certificate_path' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:512',
            'description' => 'nullable|string',
        ]);

        // Find the StudentHackathons by ID
        $StudentHackathons = StudentHackathons::findOrFail($request->id);

        // Check if the authenticated user owns the hackathon participation
        $StudentHackathons->fill($request->all());
        if ($request->hasFile('hackathon_certificate_path')) {
            // dd("test");
            $hackathon_certificate_path = $request->file('hackathon_certificate_path')->store('hackathon_certificates', 'public');
            $StudentHackathons->hackathon_certificate_path = url()->to(Storage::url($hackathon_certificate_path));
        }

        // Update the StudentHackathons attributes from the request data
        $StudentHackathons->hackathon_from_date = date('Y-m-d', strtotime($request->hackathon_from_date));
        $StudentHackathons->hackathon_to_date = date('Y-m-d', strtotime($request->hackathon_to_date));

        // Save the StudentHackathons
        $StudentHackathons->save();

        // Return a response
        return response()->json(['message' => 'Hackathon participation updated successfully', 'hackathon_participation' => $StudentHackathons]);
    }

    public function destroy(Request $request)
    {

        $request->validate([
            'id' => [
                'required',
                Rule::exists('student_hackathons')->where(function ($query) {
                    return $query->where('id', request()->id)
                                 ->where('user_id', auth()->id());
                }),
            ],
        ]);

        // Find the job placement by ID
        $jobPlacement = StudentHackathons::findOrFail($request->id);

        // Delete the job placement
        $jobPlacement->delete();

        // Return a response
        return response()->json(['message' => 'Hackathon deleted successfully']);
    }

}
