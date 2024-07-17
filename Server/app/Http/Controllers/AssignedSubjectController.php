<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\AssignedSubject;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class AssignedSubjectController extends Controller
{
    public function index()
    {
        $assignedSubjects = AssignedSubject::with('user','subject')->get();
        return response()->json($assignedSubjects);
    }

    public function store(Request $request)
    {
        // $validator = Validator::make($request->all(), [
        //     'user_id' => 'required|exists:users,id',
        //     'sem' => 'required|integer|between:1,8',
        //     'subject' => 'required|string|max:255',
        //     'pr_th' => 'required|boolean',
        //     'batch' => 'required|string|max:255',
        //     'sub_batch' => 'nullable|string|max:255',
        // ]);


        $validator = Validator::make($request->all(), [
            'user_id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $user = User::where('id', $value)->first();
                    if (!$user) {
                        $fail('User not found');
                    } elseif ($user->role !== "professor") {
                        $fail('The selected user is not a professor.');
                    }
                },
            ],
            'subject_id' => 'required|integer|exists:subjects,id',
            'pr_th' => 'required|boolean',
            'batch' => 'required|string|max:255',
            // 'sem' => 'required|integer|between:1,8',
            'sub_batch' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Create AssignedSubject instance with validated data
        $validatedData = $validator->validated();

        // dd($request->pr_th );
        if($request->pr_th == 0){
            $request->validate([
                "sub_batch" => "required|string"
            ]);
        }else{
            $validatedData['sub_batch'] = null;
        }


        $assignedSubject = AssignedSubject::create($validatedData);

        return response()->json($assignedSubject, 201);
    }

    public function show($id)
    {
        $assignedSubject = AssignedSubject::with('user','subject')->find($id);

        if (!$assignedSubject) {
            return response()->json(['message' => 'Assigned subject not found'], 404);
        }

        return response()->json($assignedSubject);
    }

    public function update(Request $request, $id)
    {
        $assignedSubject = AssignedSubject::find($id);

        if (!$assignedSubject) {
            return response()->json(['message' => 'Assigned subject not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $user = User::where('id', $value)->first();
                    if (!$user) {
                        $fail('User not found');
                    } elseif ($user->role !== "professor") {
                        $fail('The selected user is not a professor.');
                    }
                },
            ],
            'subject_id' => 'required|integer|exists:subjects,id',
            'pr_th' => 'required|boolean',
            'batch' => 'required|string|max:255',
            // 'sem' => 'required|integer|between:1,8',
            'sub_batch' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        // dd($request->pr_th );
        $validatedData = $validator->validated();
        if($request->pr_th == 0){
            $request->validate([
                "sub_batch" => "required|string"
            ]);
        }else{
            $validatedData['sub_batch'] = null;
        }


        $assignedSubject->update( $validatedData );

        return response()->json($assignedSubject);
    }

    public function destroy($id)
    {
        $assignedSubject = AssignedSubject::find($id);

        if (!$assignedSubject) {
            return response()->json(['message' => 'Assigned subject not found'], 404);
        }

        $assignedSubject->delete();

        return response()->json(['message' => 'Assigned subject deleted successfully']);
    }



    // professor personal loggedin fetch assigned subjects
    public function fetch_loggedin_professor_assigned_subject()
    {
        $id = auth()->user()->id;

        $assignedSubject = AssignedSubject::with('subject')->where("user_id",$id)->get();

        if (!$assignedSubject) {
            return response()->json(['message' => 'Assigned subject not found'], 404);
        }

        return response()->json($assignedSubject);
    }

}
