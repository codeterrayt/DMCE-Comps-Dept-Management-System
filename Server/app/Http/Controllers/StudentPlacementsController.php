<?php

namespace App\Http\Controllers;

use App\Models\StudentPlacements;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class StudentPlacementsController extends Controller
{
    //

    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'academic_year' => 'required|string|max:255',
            'campus_or_off_campus' => 'required|boolean',
            'company_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'pincode' => 'required|string|max:255',
            'package' => 'required|string|max:255',
            'domain' => 'required|string|max:255',
            'passout_year' => 'required|string|max:255',
            'offer_letter' => 'required|file|mimes:jpeg,jpg,png,pdf|max:512',
        ]);

        // Create a new StudentPlacements instance
        $StudentPlacements = new StudentPlacements();

        // Fill the StudentPlacements attributes from the request data
        $StudentPlacements->fill($request->all());


        if ($request->hasFile('offer_letter')) {
            // dd("test");
            $certificatePath = $request->file('offer_letter')->store('offer_letter', 'public');
            $StudentPlacements->offer_letter = url()->to(Storage::url($certificatePath));
        }


        // Associate the StudentPlacements with the authenticated user
        $StudentPlacements->user_id = auth()->id();

        // Save the StudentPlacements
        $StudentPlacements->save();

        // Return a response
        return response()->json(['message' => 'Job placement added successfully', 'job_placement' => $StudentPlacements]);
    }

    public function update(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'id' => [
                'required',
                Rule::exists('student_placements')->where(function ($query) {
                    return $query->where('id', request()->id)
                                 ->where('user_id', auth()->id());
                }),
            ],
            'academic_year' => 'required|string|max:255',
            'campus_or_off_campus' => 'required|boolean',
            'company_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'pincode' => 'required|string|max:255',
            'package' => 'required|string|max:255',
            'domain' => 'required|string|max:255',
            'passout_year' => 'required|string|max:255',
            'offer_letter' => 'required|file|mimes:jpeg,jpg,png,pdf|max:512',
        ]);

        // Find the StudentPlacements by ID
        $StudentPlacements = StudentPlacements::findOrFail($request->id);

        // Update the StudentPlacements attributes from the request data
        $StudentPlacements->fill($request->all());

        if ($request->hasFile('offer_letter')) {
            // dd("test");
            $certificatePath = $request->file('offer_letter')->store('offer_letter', 'public');
            $StudentPlacements->offer_letter = url()->to(Storage::url($certificatePath));
        }

        // Save the StudentPlacements
        $StudentPlacements->save();

        // Return a response
        return response()->json(['message' => 'Job placement updated successfully', 'job_placement' => $StudentPlacements]);
    }

    public function fetch(Request $request){
         // Retrieve the authenticated user
         $user = Auth::user();

         // Call fetch_internships() on the authenticated user
         $placements = $user->fetch_placements();

         // Return the internships as a JSON response
         return response()->json(["placements" => $placements]);
    }

    public function destroy(Request $request)
    {

        $request->validate([
            'id' => [
                'required',
                Rule::exists('student_placements')->where(function ($query) {
                    return $query->where('id', request()->id)
                                 ->where('user_id', auth()->id());
                }),
            ],
        ]);

        // Find the job placement by ID
        $jobPlacement = StudentPlacements::findOrFail($request->id);

        // Delete the job placement
        $jobPlacement->delete();

        // Return a response
        return response()->json(['message' => 'Job placement deleted successfully']);
    }

}
