import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, firestore, storage } from '../firebase';
import Login from './Login';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Publicpage.css';
import Swal from 'sweetalert2';

const Publicpage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false); // Loader state
    const [rcFiles, setRcFiles] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName:'',
        companyName: '',
        address: '',
        phoneNo: '',
        vehicleNo: '',
        aadharFrontData: null,
        aadharBackData: null,
        panCardFrontData: null,
        // panCardBackData: null,
        rcBookData: [],
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Auth state changed");
            if (user) {
                setIsLoggedIn(true);
                console.log("User is logged in");
            } else {
                setIsLoggedIn(false);
                console.log("User is logged out");
            }
        });

        return unsubscribe;
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log('User signed out');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleAddRcFile = () => {
        setRcFiles([...rcFiles, { id: Date.now() }]);
    };

    const handleRemoveRcFile = (id) => {
        const updatedRcFiles = rcFiles.filter((file) => file.id !== id);
        setRcFiles(updatedRcFiles);
    
        // Remove the corresponding file data from the formData state
        const updatedRcBookData = formData.rcBookData.filter((_, index) => index !== id);
        setFormData({
            ...formData,
            rcBookData: updatedRcBookData,
        });
    };
    
 
    const handleInputChange = async (e) => {
        const { name, files } = e.target;
        if (name.startsWith('rcBook')) {
            const index = parseInt(name.split('-')[1]);
            const file = files[0]; 
            if (file) {
                const rcBookData = [...formData.rcBookData];
                rcBookData[index] = file;
                setFormData({
                    ...formData,
                    rcBookData: rcBookData,
                });
            }
        } else if (name === 'aadharFront' || name === 'aadharBack' || name === 'panCardFront' ) {
            const file = files[0];
            if (file) {
                setFormData({
                    ...formData,
                    [name + 'Data']: file,
                });
            }
        } else {
            const { value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };
    

    
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loader while submitting the form

        try {
            if (formData.firstName.trim() === '') {
                alert('First Name is required');
                setLoading(false); // Hide loader
                return;
            }

            if (formData.lastName.trim() === '') {
                alert('Last Name is required');
                setLoading(false); // Hide loader
                return;
            }

            if (formData.address.trim() === '') {
                alert('Address is required');
                setLoading(false); // Hide loader
                return;
            }

            if (formData.phoneNo.trim() === '') {
                alert('Phone No is required');
                setLoading(false); // Hide loader
                return;
            }

            if (formData.vehicleNo.trim() === '') {
                alert('Vehicle No is required');
                setLoading(false); // Hide loader
                return;
            }
            const fullName = `${formData.firstName} ${formData.lastName}`;
            
            const aadharFrontURL = formData.aadharFrontData ? await uploadFileToStorage(formData.aadharFrontData) : null;
            const aadharBackURL = formData.aadharBackData ? await uploadFileToStorage(formData.aadharBackData) : null;
            const panCardFrontURL = formData.panCardFrontData ? await uploadFileToStorage(formData.panCardFrontData) : null;
            // const panCardBackURL = formData.panCardBackData ? await uploadFileToStorage(formData.panCardBackData) : null;
            const rcBookURLs = await Promise.all(formData.rcBookData.map(async (file) => {
                return await uploadFileToStorage(file);
            }));
            const formDataWithFileURLs = {
                ...formData,
                
                fullName,
                aadharFrontData: aadharFrontURL,
                aadharBackData: aadharBackURL,
                panCardFrontData: panCardFrontURL,
                // panCardBackData: panCardBackURL,
                rcBookData: rcBookURLs,
            };

            const docRef = await addDoc(collection(firestore, 'formData'), formDataWithFileURLs);
            console.log('Form data submitted successfully with ID: ', docRef.id);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Form submitted successfully!',
            });
             // Reset the form fields after successful submission
        setFormData({
            firstName: '',
            lastName: '',
            companyName: '',
            address: '',
            phoneNo: '',
            vehicleNo: '',
            aadharFrontData: null,
            aadharBackData: null,
            panCardFrontData: null,
            rcBookData: [],
        });

        setRcFiles([]);

            setLoading(false); // Hide loader
        } catch (error) {
            console.error('Error submitting form data:', error);
            setLoading(false); // Hide loader in case of error
        }
    };

    const uploadFileToStorage = async (file) => {
        try {
            const storageRef = ref(storage, `files/${file.name}`);
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };
  
    useEffect(() => {
        const timer = setTimeout(() => {
            Swal.close(); 
        }, 3000); 

        return () => clearTimeout(timer); 
    }, []);

    return (
        <section className='sections'>
            {/* Loader */}
            {loading && <div className={`loader ${loading ? 'loading' : ''}`}></div>}

            {isLoggedIn ? (
                <div>
                    <button className="logout" style={{ color: 'white', backgroundColor: 'red' }} onClick={handleLogout}>Logout</button>
                    <form className='form-public' onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="input-group">
                                <label>First Name:</label>
                                <input type="text" name="firstName" onChange={handleInputChange} required/>
                            </div>
                            <div className="input-group">
                                <label>Last Name:</label>
                                <input type="text" name="lastName" onChange={handleInputChange} required/>
                            </div>
                            <div className="input-group">
                                <label>Company Name:</label>
                                <input type="text" name="companyName" onChange={handleInputChange} required/>
                            </div>
                            
                            <div className="input-group">
                                <label>Phone No:</label>
                                <input type="text" name="phoneNo" onChange={handleInputChange} required/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-group">
                                <label>Address:</label>
                                <input type="text" name="address" onChange={handleInputChange} required/>
                            </div>
                            <div className="input-group">
                                <label>Vehicle No:</label>
                                <input type="text" name="vehicleNo" onChange={handleInputChange} required/>
                            </div>
                        </div>
                        <div>
                            <label>Aadhar Front & Back:</label>
                            <input type="file" name="aadharFront" accept="image/*" onChange={handleInputChange}required />
                            <input type="file" name="aadharBack" accept="image/*" onChange={handleInputChange} required/>
                        </div>
                        <div>
                            <label>PAN Card</label>
                            <input type="file" name="panCardFront" accept="image/*" onChange={handleInputChange} required/>
                            {/* <input type="file" name="panCardBack" accept="image/*" onChange={handleInputChange} /> */}
                        </div>
                        <div>
                            <label>RC Book:</label>
                            {rcFiles.map((file, index) => (
                                <div key={index}>
                                    <input type="file" name={`rcBook-${index}`} accept="image/*" onChange={handleInputChange} required/>
                                    <button type="button" onClick={() => handleRemoveRcFile(index)}>Remove</button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddRcFile}>Add RC File</button>
                        </div>
                        <button className="submit" type="submit">Submit</button>
                    </form>
                </div>
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </section>
    );
};

export default Publicpage;