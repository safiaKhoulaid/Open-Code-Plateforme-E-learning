@component('mail::message')
# Welcome {{ $name }}!

Thank you for registering with us. Your account has been created successfully.

Your login email is: {{ $email }}

Thanks,<br>
{{ config('app.name') }}
@endcomponent
