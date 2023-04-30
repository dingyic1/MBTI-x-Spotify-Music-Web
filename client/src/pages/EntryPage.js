import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button } from "@mui/material";
import "../styles/stylesheet.css";

function EntryPage() {
  const [mbti, setMbti] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/homepage/${mbti}`);
  };

  const handleChange = (event) => {
    setMbti(event.target.value.toUpperCase());
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <h1 className="welcome">
          Welcome to the <br />
          MBTI x Music system
        </h1>
        <TextField
          label="MBTI Type"
          variant="outlined"
          value={mbti}
          onChange={handleChange}
          fullWidth
          inputProps={{
            style: {
              color: "#8c52ff",
              backgroundColor: "white",
              fontFamily: "Sigmar",
            },
          }}
          sx={{
            "& fieldset": { border: "none" },
          }}
        />
        <Button
          type="submit"
          style={{
            marginTop: "20px",
            color: "#8c52ff",
            backgroundColor: "white",
            fontFamily: "Sigmar",
          }}
        >
          Submit
        </Button>
      </form>
      <div className="custom-font">
        <h2 style={{ marginTop: "100px" }}>About MBTI</h2>
        <div style={{ fontSize: "20px" }}>
          <p>
            The Myers-Briggs Type Indicator (MBTI) is a personality assessment
            tool used to measure personality traits and preferences. It is based
            on Carl Jung's theory of psychological types and is widely used in
            business, education, and other fields to improve communication and
            team dynamics.
          </p>
          <p>
            Don't know your MBTI? Take the free personlity test{" "}
            <a
              style={{ color: "white" }}
              href="https://www.16personalities.com/free-personality-test"
            >
              here
            </a>
          </p>
        </div>
      </div>
    </Container>
  );
}

export default EntryPage;
