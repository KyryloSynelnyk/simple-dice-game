"use client";

import { useEffect, useRef, useState } from "react";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import FormControlLabel from "@mui/material/FormControlLabel";

type GuessMode = "under" | "over";

type HistoryItem = {
  id: string;
  time: string;
  mode: GuessMode;
  threshold: number;
  result: number;
  win: boolean;
};

type NotificationItem = {
  id: string;
  win: boolean;
  detail: string;
};

function rand1to100() {
  return Math.floor(Math.random() * 100) + 1;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function Home() {
  const [mode, setMode] = useState<GuessMode>("under");
  const [threshold, setThreshold] = useState<number>(20);
  const [currentResult, setCurrentResult] = useState<number>(100);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const cooldownMs = 500;
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const cooldownTimeoutRef = useRef<number | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    return () => {
      if (cooldownTimeoutRef.current) {
        window.clearTimeout(cooldownTimeoutRef.current);
      }
    };
  }, []);

  const play = () => {
    if (isCoolingDown) return;

    setIsCoolingDown(true);
    if (cooldownTimeoutRef.current) {
      window.clearTimeout(cooldownTimeoutRef.current);
    }
    cooldownTimeoutRef.current = window.setTimeout(() => {
      setIsCoolingDown(false);
    }, cooldownMs);

    const value = rand1to100();
    const win = mode === "under" ? value < threshold : value > threshold;

    const detail = win
      ? ""
      : mode === "under"
        ? "Number was higher"
        : "Number was lower";

    setCurrentResult(value);
    const notificationId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setNotifications((prev) => [{ id: notificationId, win, detail }, ...prev]);

    const item: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      time: formatTime(new Date()),
      mode,
      threshold,
      result: value,
      win,
    };

    setHistory((prev) => [item, ...prev].slice(0, 10));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        pt: 6,
        pb: 6,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} alignItems="center" sx={{ mt: "80px" }}>
          <Paper
            elevation={0}
            sx={{
              width: 400,
              height: 220,
              p: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.100",
              borderRadius: 1,
            }}
          >
            <Typography variant="h2" sx={{ fontSize: "96px", fontWeight: 300 }}>
              {currentResult}
            </Typography>
          </Paper>

          <RadioGroup
            row
            value={mode}
            onChange={(e) => setMode(e.target.value as GuessMode)}
          >
            <FormControlLabel
              value="under"
              control={<Radio />}
              label="Under"
            />
            <FormControlLabel value="over" control={<Radio />} label="Over" />
          </RadioGroup>

          <Box sx={{ width: 420, px: 1 }}>
            <Slider
              value={threshold}
              onChange={(_, v) => setThreshold(v as number)}
              valueLabelDisplay="on"
              min={1}
              max={100}
              step={1}
              marks={[
                { value: 1, label: "1" },
                { value: 100, label: "100" },
              ]}
            />
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={play}
            disabled={isCoolingDown}
            sx={{ width: 420, py: 1.5 }}
          >
            PLAY
          </Button>

          <Box sx={{ width: 600 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 120 }}>Time</TableCell>
                  <TableCell sx={{ width: 220 }}>Guess</TableCell>
                  <TableCell sx={{ width: 120 }}>
                    Result
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((row) => {
                  const rowGuess = `${row.mode === "under" ? "Under" : "Over"} ${
                    row.threshold
                  }`;

                  return (
                    <TableRow key={row.id}>
                      <TableCell>{row.time}</TableCell>
                      <TableCell>{rowGuess}</TableCell>
                      <TableCell>
                        <Typography
                          component="span"
                          sx={{
                            color: row.win ? "success.main" : "error.main",
                            fontWeight: 500,
                          }}
                        >
                          {row.result}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ color: "text.secondary" }}>
                      No games yet
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </Box>
        </Stack>
      </Container>

      {notifications.map((n, index) => (
        <Snackbar
          key={n.id}
          open
          onClose={() => removeNotification(n.id)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={2500}
          sx={{ top: `${24 + index * 72}px` }}
        >
          <Alert
            severity={n.win ? "success" : "error"}
            icon={n.win ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
            onClose={() => removeNotification(n.id)}
            sx={{
              width: 600,
              maxWidth: "95vw",
              bgcolor: n.win ? "#2e7d32" : "#d32f2f",
              color: "#fff",
              "& .MuiAlertTitle-root": { color: "#fff" },
              "& .MuiAlert-icon": { color: "#fff" },
              "& .MuiAlert-action": { color: "#fff" },
              ...(n.win
                ? {
                    minHeight: 50,
                    display: "flex",
                    alignItems: "center",
                    "& .MuiAlert-message": {
                      display: "flex",
                      alignItems: "center",
                    },
                  }
                : null),
            }}
          >
            <AlertTitle sx={n.win ? { mt: "5px" } : undefined}>
              {n.win ? "You won" : "You lost"}
            </AlertTitle>
            {!n.win ? n.detail : null}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
}
