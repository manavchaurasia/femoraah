import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import toast from 'react-hot-toast';

const Layout = () => {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    assignee: 'Zinia',
    priority: 'Medium',
    details: '',
    dueDate: '2026-10-14'
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    toast.success(`Task "${taskForm.title}" created for ${taskForm.assignee}!`);
    setShowAddTaskModal(false);
    setTaskForm({ title: '', assignee: 'Zinia', priority: 'Medium', details: '', dueDate: '2026-10-14' });
  };

  return (
    <div>
      <Navbar onAddTask={() => setShowAddTaskModal(true)} />
      <main>
        <Outlet />
      </main>

      {/* Global Add Task Modal */}
      {showAddTaskModal && (
        <div className="modal-overlay" onClick={() => setShowAddTaskModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Task</h3>
              <button className="action-icon-btn" onClick={() => setShowAddTaskModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  placeholder="e.g. Update catalog barcodes on Flipkart"
                  value={taskForm.title}
                  onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Assignee</label>
                  <select 
                    className="form-select"
                    value={taskForm.assignee}
                    onChange={e => setTaskForm({...taskForm, assignee: e.target.value})}
                  >
                    <option value="Zinia">Zinia (Customer Support)</option>
                    <option value="Shruti">Shruti (Listings Lead)</option>
                    <option value="Sanket">Sanket (Warehouse Lead)</option>
                    <option value="Dev">Dev (Packing)</option>
                    <option value="Kartik">Kartik (Founder)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select 
                    className="form-select"
                    value={taskForm.priority}
                    onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={taskForm.dueDate}
                  onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Task Details / Instructions</label>
                <textarea 
                  className="form-textarea" 
                  rows="3"
                  placeholder="Additional context, links, or notes..."
                  value={taskForm.details}
                  onChange={e => setTaskForm({...taskForm, details: e.target.value})}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAddTaskModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
