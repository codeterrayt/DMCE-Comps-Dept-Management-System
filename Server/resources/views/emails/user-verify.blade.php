<DOCTYPE html>
    <html lang="en-US">

        <head>
            <meta charset="utf-8">
        </head>

        <body>
            <p>Dear {{$user->name}},</p>
            <p>
                Please click the button below to verify your email address.
            </p>


            <a href="{{ $actionUrl }}" class="button">{{$actionText}}</a>

            <p>If you did not create an account, no further action is required.</p>

            <p>
                Best regards, <br>

                {{ config('app.name')}}
            </p>

            <p>
                <hr>
                <span class="break-all">
                <strong>If you’re having trouble clicking the link, copy and paste the URL below into your web browser:</strong><br/>
                <em>{{$actionUrl}}</em>
            </p>



        </body>

    </html>
