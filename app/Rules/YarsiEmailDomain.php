<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class YarsiEmailDomain implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // Extract domain from email
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        // Get domain from email (everything after @)
        $parts = explode('@', $value);
        if (count($parts) !== 2) {
            return false;
        }

        $domain = $parts[1];

        // Check if domain ends with yarsi.ac.id
        // This accepts: yarsi.ac.id, students.yarsi.ac.id, dosen.yarsi.ac.id, etc.
        return $domain === 'yarsi.ac.id' || str_ends_with($domain, '.yarsi.ac.id');
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Email harus menggunakan subdomain Universitas Yarsi (@yarsi.ac.id).';
    }
}
