<?php

namespace App\Http\Controllers;

use App\Models\StudentInternship;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

    public function update_student(Request $request, int $id)
    {
        $user = User::where('id', $id)->where("role","student")->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'],404);
        }

        // dd($user->id);

        $rules = [
            'name' => 'required|string|max:255',
            'middle_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            // 'password' => 'nullable|string|min:8',
            'roll_no' => 'required|string|max:255|unique:users,roll_no,' . $user->id,
            'student_id' => 'required|string|max:255|unique:users,student_id,' . $user->id,
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

}
