<?php

namespace App\Http\Controllers;

use App\Models\StudentAchivements;
use App\Models\StudentExtraCu;
use App\Models\StudentHackathons;
use App\Models\StudentInternship;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        $query->where('role', 'student');

        // Apply filter by name and email combined
        if ($request->has('search')) {
            $searchTerm = '%' . $request->input('search') . '%';
            $query->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', $searchTerm)
                    ->orWhere('email', 'like', $searchTerm);
            });
        }

        // Apply filter by roll number
        if ($request->has('roll_no')) {
            $direction = $request->input('roll_no') === 'desc' ? 'desc' : 'asc';
            $query->orderBy('roll_no', $direction);
        }

        // Apply filter by admitted year
        if ($request->has('admitted_year') && is_numeric($request->input('admitted_year'))) {
            $query->where('admitted_year', $request->input('admitted_year'));
        }

        // Apply filter by division
        if ($request->has('div')) {
            $query->where('div', $request->input('div'));
        }

        if ($request->has('higher_studies')) {
            if ($request->input('higher_studies') == 1) {
                $query->whereHas('studentHigherStudies');
            } else {
                $query->whereDoesntHave('studentHigherStudies');
            }
        }

        if ($request->has('internship')) {
            if ($request->input('internship') == 1) {
                $query->whereHas('studentInternship');
            } else {
                $query->whereDoesntHave('studentInternship');
            }
        }

        if ($request->has('achievements')) {
            if ($request->input('achievements') == 1) {
                $query->whereHas('studentAchievements');
            } else {
                $query->whereDoesntHave('studentAchievements');
            }
        }

        if ($request->has('ecc')) {
            if ($request->input('ecc') == 1) {
                $query->whereHas('StudentExtraCurr');
            } else {
                $query->whereDoesntHave('StudentExtraCurr');
            }
        }

        if ($request->has('hackathons')) {
            if ($request->input('hackathons') == 1) {
                $query->whereHas('StudentHackathons');
            } else {
                $query->whereDoesntHave('StudentHackathons');
            }
        }

        if ($request->has('placements')) {
            if ($request->input('placements') == 1) {
                $query->whereHas('StudentPlacements');
            } else {
                $query->whereDoesntHave('StudentPlacements');
            }
        }

        if ($request->has('placement_type')) {
            $placementsValue = $request->input('placement_type');
            $query->whereHas('StudentPlacements', function ($query) use ($placementsValue) {
                $query->where('campus_or_off_campus', $placementsValue);
            });
        }



        // Get page number from request, default to 1
        $page = $request->input('page', 1);

        // Get items per page from request, default to 10
        $perPage = $request->input('per_page', 10);

        // Paginate the query
        $users = $query->paginate($perPage, ['*'], 'page', $page);

        // Execute the query and return results
        $users = $query->get();

        // Return the filtered users as JSON response
        return response()->json($users);
    }

    public function fetch_internship_by_student_id(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        // Get the student ID from the request
        $studentId = $request->input('student_id');

        // Query the StudentInternship model to fetch internships by student ID
        $internships = User::where("id", $studentId)->with("studentInternship")->get();

        // Return the fetched internships as a JSON response
        return response()->json(['data' => $internships]);
    }

    public function fetch_ecc_by_student_id(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        // Get the student ID from the request
        $studentId = $request->input('student_id');

        // Query the StudentInternship model to fetch internships by student ID
        $ecc = User::where("id", $studentId)->with("StudentExtraCurr")->get();

        // Return the fetched internships as a JSON response
        return response()->json(['data' => $ecc]);
    }

    public function fetch_achievements_by_student_id(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        // Get the student ID from the request
        $studentId = $request->input('student_id');

        // Query the StudentInternship model to fetch internships by student ID
        $studentAchievements = User::where("id", $studentId)->with("studentAchievements")->get();

        // Return the fetched internships as a JSON response
        return response()->json(['data' => $studentAchievements]);
    }

    public function fetch_hackathons_by_student_id(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        // Get the student ID from the request
        $studentId = $request->input('student_id');

        // Query the StudentInternship model to fetch internships by student ID
        $StudentHackathons = User::where("id", $studentId)->with("StudentHackathons")->get();

        // Return the fetched internships as a JSON response
        return response()->json(['data' => $StudentHackathons]);
    }

    public function fetch_higherstudies_by_student_id(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        // Get the student ID from the request
        $studentId = $request->input('student_id');

        // Query the StudentInternship model to fetch internships by student ID
        $studentHigherStudies = User::where("id", $studentId)->with("studentHigherStudies")->get();

        // Return the fetched internships as a JSON response
        return response()->json(['data' => $studentHigherStudies]);
    }

    public function fetch_placements_by_student_id(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        // Get the student ID from the request
        $studentId = $request->input('student_id');

        // Query the StudentInternship model to fetch internships by student ID
        $StudentPlacements = User::where("id", $studentId)->with("StudentPlacements")->get();

        // Return the fetched internships as a JSON response
        return response()->json(['data' => $StudentPlacements]);
    }

    public function update_student(Request $request)
    {
        $user = User::where('id', $request->id)->where('role', 'student')->first();

        if (!$user) {
            return response()->json(["error"=>"Student Not Found!"],404);
        }

        $rules = [
            'id' => [
                'required',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->where('role', 'student');
                }),
            ],
            'name' => 'required|string|max:255',
            'middle_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . ($user ? $user->id : null),
            // 'password' => 'nullable|string|min:8',
            'roll_no' => 'required|string|max:255|unique:users,roll_no,' . ($user ? $user->id : null),
            'student_id' => 'required|string|max:255|unique:users,student_id,' . ($user ? $user->id : null),
            'admitted_year' => 'required|numeric|min:1900|max:' . date('Y'),
            'div' => 'required|string|max:2',
            // 'role' => [
            //     'required',
            //     Rule::in(['admin', 'student']), // assuming role can only be one of these values
            // ],
        ];




        // Get only the fields specified in the rules
        $data = $request->only(array_keys($rules));

        // Remove the "role" field if it exists in the request data
        if (array_key_exists('role', $data)) {
            unset($data['role']);
        }


        // Validate the data
        $validator = Validator::make($data, $rules);

        // Check if validation fails
        if ($validator->fails()) {
            // Handle validation errors
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if validation fails
        if ($validator->fails()) {
            // Handle validation errors
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Validation passed, update the user
        $user->update($data);

        // Return success response
        return response()->json(['message' => 'User updated successfully', 'data'=> $user]);


    }



    public function update_internship(Request $request){

        // Find the internship by ID

        $request->validate([
            'id' => 'required|exists:student_internships,id',
            'academic_year' => 'required|string|max:255',
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

    public function update_achievement(Request $request){
        $request->validate([
            'id' => 'required|exists:student_achievements,id',
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

        // Save the Achievement
        $achievement->save();
        // Return a response
        return response()->json(['message' => 'Achievement updated successfully', 'internship' => $achievement]);
    }

    public function update_ecc(Request $request){
        $request->validate([
            'id' => 'required|exists:student_extra_cus,id',
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


    public function update_hackathon(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'id' =>'required|exists:student_hackathons,id',
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


}
