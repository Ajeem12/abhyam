import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlotProjectList } from '../redux/slices/plotProjectListSlice';
import { Link } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

const PlotsList = () => {
    const dispatch = useDispatch();
    const { projects, loading, error } = useSelector(state => state.plotProjects);

    useEffect(() => {
        dispatch(fetchPlotProjectList());
    }, [dispatch]);

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading projects...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    if (!projects || projects.length === 0) {
        return <div className="text-center py-8 text-gray-500">No projects found.</div>;
    }

    return (
        <>
            <div className="p-2">
                <Breadcrumbs />
            </div>
            <div className="max-w-6xl mx-auto p-4 sm:p-6">


                {/* Table header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-gray-300 pb-2 font-semibold text-gray-700">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Project Name</div>
                    <div className="col-span-6">Project Area Address</div>
                </div>

                {/* Table rows */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-2 text-blue-700">
                    {projects?.data?.map((project, index) => (
                        <Link
                            to={`/plotlist/${project.id}`}
                            key={project.id}
                            className="sm:col-span-12 grid grid-cols-12 gap-4 items-center p-3 rounded-lg shadow-sm hover:bg-gray-50 transition cursor-pointer"
                        >
                            {/* Index */}
                            <div className="col-span-1 text-sm font-medium text-gray-600">{index + 1}</div>

                            {/* Project Name */}
                            <div className="col-span-10 text-sm font-semibol w-full">
                                {project.project_name || "-"}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PlotsList;


