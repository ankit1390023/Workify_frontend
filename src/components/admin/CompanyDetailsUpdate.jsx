import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import Loader from '../ui/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import useGetSingleCompany from '../hooks/useGetSigleCompany';


// Define the schema using Zod
const companySchema = z.object({
  companyName: z.string().nonempty('Company name is required'),
  location: z.string().nonempty('Location is required'),
  website: z.string().url('Invalid URL format'),
  description: z.string().optional(),
  logo: z
    .instanceof(FileList)
    .refine(
      (fileList) => fileList.length > 0 && fileList[0].type.startsWith('image/'),
      { message: 'A logo is required, and it must be an image file.' }
    ),
});

const CompanyDetailsUpdate = () => {
  const params = useParams();
  const companyId = params?.id;
  useGetSingleCompany(companyId);
  const company = useSelector((store) => store.company?.singleCompany);

  const [logoPreview, setLogoPreview] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(companySchema),
  });

  // Set form default values once company data is fetched
  useEffect(() => {
    if (company) {
      setValue('companyName', company?.companyName || '');
      setValue('location', company?.location || '');
      setValue('website', company?.website || '');
      setValue('description', company?.description || '');
    }
  }, [company, setValue]);

  // Handle logo change and preview
  const onLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview('');
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('companyName', data.companyName);
    formData.append('location', data.location);
    formData.append('website', data.website);
    if (data.description) formData.append('description', data.description);
    if (data?.logo && data?.logo[0]) formData.append('logo', data.logo[0]);

    try {
      const res = await axios.post(`${API_END_POINT}/company/update/${companyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success('Company details updated successfully.');
        navigate('/admin/companies');
      } else {
        toast.error(`Failed to update company details: ${res.data.message}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during update';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 my-10 bg-white rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Update Company Details</h1>
      <p className="text-gray-600 text-sm mb-6">
        Make sure the correct company details are filled. Changes will reflect for students.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Name */}
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              type="text"
              {...register('companyName')}
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
            className="mt-1"
          />
          {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
        </div>

        {/* Logo */}
        <div>
          <Label htmlFor="logo">Upload Logo (Image)</Label>
          <div className="flex items-center space-x-4">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo Preview" className="w-16 h-16 object-cover rounded" />
            ) : null}
            <Input
              id="logo"
              type="file"
              accept=".jpg,.png,.jpeg"
              {...register('logo')}
              onChange={onLogoChange}
              className="mt-1"
            />
          </div>
          {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
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
            Update
          </Button>
        </div>
      </form>

      {/* Show Loader */}
      {isSubmitting && <Loader message="Submitting..." />}
    </div>
  );
};

export default CompanyDetailsUpdate;
