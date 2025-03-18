import React, { useEffect, useState } from 'react';
import apiRequest from '../Api/apiRequest.js'; // Adjust the path as necessary
import './UserList.css'; // Optional: for styling

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiRequest.get('/auth/espaceAdmin');
                setUsers(response.data);
            } catch (err) {
                setError('Error fetching users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleStatusChangeClick = (email) => {
        setSelectedUserEmail(email);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUserEmail('');
    };

    const handleChangeStatus = async () => {
        try {
            await apiRequest.put(`/auth/updateUserActivation/${selectedUserEmail}`);
            // Optionally refresh the user list after status change
            const response = await apiRequest.get('/auth/espaceAdmin');
            setUsers(response.data);
            alert(`Status updated for ${selectedUserEmail}`);
        } catch (err) {
            alert('Error updating status');
        } finally {
            handleCloseModal();
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="user-list">
            <h2 style={{color:"blue", fontWeight:"bold"}}>Liste des utilisateurs</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th> {/* Added Actions column */}
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.nom}</td>
                            <td>{user.prenom}</td>
                            <td>{user.email}</td>
                            <td>{user.isActive ? 'Actif' : 'Inactif'}</td>
                            <td>
                                <button onClick={() => handleStatusChangeClick(user.email)}>
                                    Change Status
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for confirming status change */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Modifier le statut</h3>
                        <p>Voulez-vous modifier le statut de l'utilisateur "{selectedUserEmail}"?</p>
                        <button style={{backgroundColor:"green",padding:"1rem",marginRight:"3rem",marginUp:"1rem",color:"white"}} onClick={handleChangeStatus}>Changer le Statut</button>
                        <button style={{backgroundColor:"red",padding:"1rem",marginRight:"3rem",color:"white"}} onClick={handleCloseModal}>Fermer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
