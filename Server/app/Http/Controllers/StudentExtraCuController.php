<?php

namespace App\Http\Controllers;

use App\Models\StudentExtraCu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class StudentExtraCuController extends Controller
{
    public function fetch(Request $request){
        // Retrieve the authenticated user
        $user = Auth::user();

        // Call fetch_internships() on the authenticated user
        $ecc = $user->fetch_extra_curr();

        // Return the internships as a JSON response
        return response()->json(["ecc" => $ecc]);
  }

  public function store(Request $request)
  {
      // Validate the incoming request data
      $request->validate([
          'academic_year' => 'required|string|max:255',
          'student_year' => 'required|string|max:255',
          'ecc_certificate_path' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:512',
          'ecc_domain' => 'required|string|max:255',
          'college_name' => 'required|string|max:255',
          'ecc_level' => 'required|string|max:255',
          'ecc_location' => 'required|string|max:255',
          'ecc_date' => 'required|date',
          'prize' => 'nullable|string|max:255',
      ]);

      // Create a new ecc instance
      $ecc = new StudentExtraCu();

      // Fill the ecc attributes from the request data
      $ecc->fill($request->all());

      if ($request->hasFile('ecc_certificate_path')) {
          // dd("test");
          $certificatePath = $request->file('ecc_certificate_path')->store('ecc_certificate', 'public');
          $ecc->ecc_certificate_path = url()->to(Storage::url($certificatePath));
      }

      // Associate the ecc with the authenticated user
      $ecc->ecc_date = date('Y-m-d', strtotime($request->ecc_date));
      $ecc->user_id = auth()->id();

      // Save the ecc
      $ecc->save();

      // Return a response
      return response()->json(['message' => 'extra curricular activities stored successfully', 'ecc' => $ecc]);
  }

  public function update(Request $request)
  {
      // Validate the incoming request data
       // Validate the incoming request data
       $request->validate([
          'id' => [
              'required',
              Rule::exists('student_extra_cus')->where(function ($query) {
                  return $query->where('id', request()->id)
                               ->where('user_id', auth()->id());
              }),
          ],
          'academic_year' => 'required|string|max:255',
          'student_year' => 'required|string|max:255',
          'ecc_certificate_path' => 'nullable|file|mimes:jpeg,jpg,png,pdf|max:512',
          'ecc_domain' => 'required|string|max:255',
          'college_name' => 'required|string|max:255',
          'ecc_level' => 'required|string|max:255',
          'ecc_location' => 'required|string|max:255',
          'ecc_date' => 'required|date',
          'prize' => 'nullable|string|max:255',
          // Add validation rules for other internship attributes here
      ]);

      // Find the internship by ID
      $ecc = StudentExtraCu::findOrFail($request->id);

      // Update the internship attributes if the corresponding file exists in the request

      $ecc->fill($request->all());

      if ($request->hasFile('ecc_certificate_path')) {
          // dd("test");
          $certificatePath = $request->file('ecc_certificate_path')->store('ecc_certificate', 'public');
          $ecc->ecc_certificate_path = url()->to(Storage::url($certificatePath));
      }

      // Associate the ecc with the authenticated user
      $ecc->ecc_date = date('Y-m-d', strtotime($request->ecc_date));
      $ecc->user_id = auth()->id();

      // Save the ecc
      $ecc->save();
      // Return a response
      return response()->json(['message' => 'Internship updated successfully', 'ecc' => $ecc]);
  }

  public function fetchEccById($id){
    $user = Auth::user();
    $student_internship = StudentExtraCu::where("user_id",$user->id)->where("id",$id)->first();
    // Get the currently authenticated user

    if($student_internship === null){
        return response()->json([
            "message" => "Ecc Not Found"
        ], 404);
    }
    return response()->json($student_internship);
  }

  public function destroy(Request $request)
  {

      $request->validate([
          'id' => [
              'required',
              Rule::exists('student_extra_cus')->where(function ($query) {
                  return $query->where('id', request()->id)
                               ->where('user_id', auth()->id());
              }),
          ],
      ]);

      // Find the job placement by ID
      $jobPlacement = StudentExtraCu::findOrFail($request->id);

      // Delete the job placement
      $jobPlacement->delete();

      // Return a response
      return response()->json(['message' => 'Student Extra Cur deleted successfully']);
  }


}
