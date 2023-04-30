import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Container,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import "../styles/stylesheet.css";

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? "h5" : "h7"}
      noWrap
      // style={{
      //   marginRight: "30px",
      //   fontFamily: "monospace",
      //   fontWeight: 700,
      //   letterSpacing: ".3rem",
      // }}
      className="font-link"
    >
      <NavLink
        to={href}
        style={{
          color: "inherit",
          textDecoration: "none",
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
};

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  return (
    <AppBar position="static" style={{ background: "#8C52FF" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <Menu />
          </IconButton>
          <NavText href="/" text="Music x MBTI" isMain />
        </Toolbar>
      </Container>
      <Drawer anchor="left" open={showDrawer} onClose={toggleDrawer}>
        <List
          style={{
            backgroundColor: "#f5f5f5",
            height: "100%",
            fontFamily: "monospace",
            fontWeight: 700,
          }}
        >
          <ListItem
            button
            component={NavLink}
            to="/albums"
            onClick={toggleDrawer}
          >
            <ListItemText primary="1. Albums" />
          </ListItem>
          <ListItem
            button
            component={NavLink}
            to="/songs"
            onClick={toggleDrawer}
          >
            <ListItemText primary="2. Search Songs" />
          </ListItem>
          <ListItem
            button
            component={NavLink}
            to="/artists"
            onClick={toggleDrawer}
          >
            <ListItemText primary="3. Artists" />
          </ListItem>
        </List>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="back"
          IconButton="close"
        >
          <Menu onClick={toggleDrawer} />
        </IconButton>
      </Drawer>
    </AppBar>
  );
}
