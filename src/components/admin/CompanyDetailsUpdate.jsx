import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import useGetSingleCompany from '../hooks/useGetSigleCompany';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
const API_END_POINT = import.meta.env.VITE_API_END_POINT;
// Define the schema using Zod
const companySchema = z.object({
  companyName: z.string().nonempty('Company name is required'),
  location: z.string().nonempty('Location is required'),
  website: z.string().url('Invalid URL format'),
  description: z.string().optional(),
  logo: z
    .instanceof(FileList)
    .optional()
    .refine(
      (fileList) => !fileList || fileList.length === 0 || fileList[0].type.startsWith('image/'),
      { message: 'Logo must be an image file.' }
    ),
});

const CompanyDetailsUpdate = () => {
  const params = useParams();
  const companyId = params?.id;
  console.log("companyId", companyId);
  useGetSingleCompany(companyId);
  const company = useSelector((store) => store.company?.singleCompany);
  const { theme } = useTheme();

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
    try {
      const formData = new FormData();
      formData.append('companyName', data.companyName);
      formData.append('location', data.location);
      formData.append('website', data.website);
      if (data.description) formData.append('description', data.description);
      if (data?.logo && data?.logo[0]) {
        formData.append('logo', data.logo[0]);
      }

      const res = await axios.put(`${API_END_POINT}/company/update/${companyId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
      });

      if (res.data.statusCode === 200) {
        toast.success("Company details updated successfully");
        navigate('/admin/companies');
      } else {
        toast.error(res.data.message || "Failed to update company details");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error(error.response?.data?.message || "Failed to update company details");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header/>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-8 my-10"
      >
        <Card className="border border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Admin Dashboard</span>
                </motion.div>
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Update Company Details
                </CardTitle>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <span className="text-sm text-muted-foreground">Last Updated:</span>
                <span className="text-sm font-medium text-foreground">{new Date().toLocaleDateString()}</span>
              </motion.div>
            </div>
            <CardDescription className="text-base text-muted-foreground leading-relaxed">
              Manage and update company information that will be visible to students. Ensure all details are accurate and up-to-date.
            </CardDescription>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm text-muted-foreground">Verified</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="companyName" className="text-foreground font-medium">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    {...register('companyName')}
                    className="mt-2 bg-background/50 text-foreground border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companyName.message}
                    </p>
                  )}
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="location" className="text-foreground font-medium">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    {...register('location')}
                    className="mt-2 bg-background/50 text-foreground border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Website */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="website" className="text-foreground font-medium">Website</Label>
                <Input
                  id="website"
                  type="url"
                  {...register('website')}
                  className="mt-2 bg-background/50 text-foreground border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
                {errors.website && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.website.message}
                  </p>
                )}
              </motion.div>

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="logo" className="text-foreground font-medium">Company Logo</Label>
                <div className="mt-2 flex items-center space-x-4">
                  {logoPreview ? (
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src={logoPreview}
                      alt="Logo Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-800"
                    />
                  ) : null}
                  <div className="flex-1">
                    <Input
                      id="logo"
                      type="file"
                      accept=".jpg,.png,.jpeg"
                      {...register('logo')}
                      onChange={onLogoChange}
                      className="bg-background/50 text-foreground border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>
                {errors.logo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.logo.message}
                  </p>
                )}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label htmlFor="description" className="text-foreground font-medium">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  className="mt-2 bg-background/50 text-foreground border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20 transition-all duration-200 min-h-[120px]"
                />
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-end space-x-4 pt-6"
              >
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/companies')}
                  className="px-6 py-2 border border-gray-200 dark:border-gray-800 text-foreground rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  Cancel
                </Button>
                   <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Company'
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <Footer/>
    </div>
  );
};

export default CompanyDetailsUpdate;