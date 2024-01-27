import { CircularProgress, Container } from '@mui/material';

export default function FullPageLoader() {
  return (
    <Container
      maxWidth="xl"
      className="w-full h-full flex justify-center items-center"
    >
      <CircularProgress />
    </Container>
  );
}