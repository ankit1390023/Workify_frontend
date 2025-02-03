import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import Loader from '../ui/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';

// Define the schema using Zod
const companySchema = z.object({
  companyName: z.string().nonempty('Company name is required'),
  location: z.string().nonempty('Location is required'),
  website: z.string().url('Invalid URL format'),
  description: z.string().optional(),
 
});

const CompaniesCreate = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting },
  } = useForm({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('companyName', data.companyName);
    formData.append('location', data.location);
    formData.append('website', data.website);
    if (data.description) formData.append('description', data.description);
    // if (data?.logo && data?.logo[0]) formData.append('logo', data.logo[0]);

    try {
    
      const res = await axios.post(`${API_END_POINT}/company/register`, formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('acessToken')}`
        },
      });

      if (res.data.success) {
        toast.success('Company registered successfully.');
        const companyId = res?.data?.data?._id;
        console.log(companyId);
        navigate(`/admin/companies/${companyId}`);
      } else {
        toast.error(`Failed to register company: ${res.data.message}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred during reegister company";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 my-10 bg-white rounded-lg ">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Register a New Company</h1>
      <p className="text-gray-600 text-sm mb-6">
        Please provide your company details. You can update them later if needed.
      </p>
     
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Name */}
          <div>
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              type="text"
              {...register('companyName')}
              placeholder="Enter company name"
              className="mt-1"
            />
            {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              {...register('location')}
              placeholder="Enter location (e.g., Bangalore, Pune)"
              className="mt-1"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>
        </div>

        {/* Website */}
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            {...register('website')}
            placeholder="Enter website URL"
            className="mt-1"
          />
          {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
        </div>

       

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Enter company description (optional)"
            className="mt-1"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            onClick={() => navigate('/admin/companies')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700`}

          >
            Register
          </Button>
        </div>
      </form>
      {/* Show Loader */}
      {isSubmitting && <Loader message="Submitting..." />} 
    </div>
  );
};

export default CompaniesCreate;
