import { List, ListItem, ListItemText } from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
 
import './Task.css';
 
const Task = ({ taskText, priority, onClick }) => {
    // Map the priority enum to readable text
    const priorityMap = ['Low', 'Medium', 'High'];
    const priorityLabel = priorityMap[priority];
    const getPriorityClass = (priority) => {
        console.log(priority)
        switch (priority) {
            case 0n: // Low
                return 'prioritylow';
            case 1n: // Medium
                return 'prioritymedium';
            case 2n: // High
                return 'priorityhigh';
            default:
                return 'prioritylow'; 
        }
    };
    return (
        <List className={`todo__list ${getPriorityClass(priority)}`}>
            <ListItem>
                <ListItemText primary={taskText} /> <ListItemText secondary={priorityLabel} secondaryTypographyProps={{ style: { fontWeight: 'bold' }} } />
            </ListItem>
            
            <DeleteTwoToneIcon fontSize="medium" color="error" style={{ margin: "10px", opacity: 1 }} onClick={onClick} />
        </List>
    )
};
    
export default Task;