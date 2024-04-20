import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { formatAsPrice } from "~/utils/utils";
import CardActions from "@mui/material/CardActions";
import AddProductToCart from "~/components/AddProductToCart/AddProductToCart";
import Card from "@mui/material/Card";
import { useProduct, useProducts } from "~/queries/products";
import { useParams } from "react-router-dom";

export default function PageProduct() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useProduct(id);

  if (isLoading || !data) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box py={3}>
      <Card
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <CardMedia
          sx={{ pt: "56.25%" }}
          image={`https://source.unsplash.com/random?sig=${data.id}`}
          title="Image title"
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {data.title}
          </Typography>
          <Typography>{formatAsPrice(data.price)}</Typography>
        </CardContent>
        <CardActions>
          <AddProductToCart product={data} />
        </CardActions>
      </Card>
    </Box>
  );
}
