import React from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TableSortLabel,
  Box,
  Tooltip,
  LinearProgress,
  Typography
} from '@mui/material';
import { getNormalizedScores, calculateWeightedScore } from '../utils/scoreNormalizer';

function TireDataVisualization({ products, preferences }) {
  const [sortConfig, setSortConfig] = React.useState({
    key: 'attractivenessScore',
    direction: 'desc'
  });

  const sortedProducts = React.useMemo(() => {
    if (!products.length) return [];
    if (!preferences) return products;

    try {
      // Calculate normalized scores and weighted scores for all products
      const productsWithScores = products.map(product => {
        const normalizedScores = getNormalizedScores(product, products);
        const attractivenessScore = calculateWeightedScore(normalizedScores, preferences);
        return {
          ...product,
          normalizedScores,
          attractivenessScore: Math.round(attractivenessScore * 100) // Convert to 0-100 integer
        };
      });

      // Sort by attractiveness score by default
      return [...productsWithScores].sort((a, b) => 
        b.attractivenessScore - a.attractivenessScore
      );

    } catch (error) {
      console.error('Error calculating scores:', error);
      return products;
    }
  }, [products, preferences, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc'
    });
  };

  const SortableHeader = ({ label, field, tooltip }) => (
    <TableCell>
      <Tooltip title={tooltip || ''} arrow>
        <TableSortLabel
          active={sortConfig.key === field}
          direction={sortConfig.key === field ? sortConfig.direction : 'asc'}
          onClick={() => handleSort(field)}
        >
          {label}
        </TableSortLabel>
      </Tooltip>
    </TableCell>
  );

  return (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <SortableHeader 
              label="Rengas Gurun Pisteet" 
              field="attractivenessScore"
              tooltip="Kokonaisarvosana perustuen valitsemiisi painotuksiin"
            />
            <SortableHeader 
              label="Myyjä" 
              field="vendor" 
              tooltip="Rengasliike"
            />
            <SortableHeader 
              label="Merkki" 
              field="brand"
              tooltip="Rengasvalmistaja"
            />
            <SortableHeader 
              label="Malli" 
              field="model"
              tooltip="Rengasmalli"
            />
            <SortableHeader 
              label="Koko" 
              field="size"
              tooltip="Rengaskoko (leveys/profiili/vannekoko)"
            />
            <SortableHeader 
              label="Hinta" 
              field="price"
              tooltip="Hinta euroissa"
            />
            <SortableHeader 
              label="Käyttäjäarvio" 
              field="dex_rating"
              tooltip="Käyttäjien antama arvosana (1-5 tähteä)"
            />
            <SortableHeader 
              label="Märkäpito" 
              field="wet_grip"
              tooltip="EU-rengasmerkinnän mukainen märkäpitoluokitus (A-E)"
            />
            <TableCell>Polttoainetaloudellisuus</TableCell>
            <TableCell>Melutaso</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow 
              key={product.id} 
              hover
              sx={{
                backgroundColor: product.attractivenessScore >= 90 ? 'rgba(76, 175, 80, 0.08)' : 'inherit'
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    {product.attractivenessScore} pistettä
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={product.attractivenessScore}
                    sx={{ 
                      width: 100,
                      height: 8,
                      borderRadius: 1
                    }}
                  />
                  <Tooltip title={
                    <Box>
                      <Typography variant="caption">Pisteytyksen perusteet:</Typography>
                      <pre>
                        {JSON.stringify({
                          'Hinta': Math.round(product.normalizedScores.price * 100),
                          'Märkäpito': Math.round(product.normalizedScores.wetGrip * 100),
                          'Polttoainetalous': Math.round(product.normalizedScores.fuelEfficiency * 100),
                          'Käyttäjätyytyväisyys': Math.round(product.normalizedScores.satisfaction * 100),
                          'Melutaso': Math.round(product.normalizedScores.noise * 100)
                        }, null, 2)}
                      </pre>
                    </Box>
                  } arrow>
                    <Box sx={{ ml: 1, cursor: 'help' }}>ℹ️</Box>
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell>
                {product.url ? (
                  <Box 
                    component="a"
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {product.vendor}
                  </Box>
                ) : product.vendor}
              </TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell>{product.model}</TableCell>
              <TableCell>{`${product.width}/${product.profile}R${product.rim_size}`}</TableCell>
              <TableCell>€{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</TableCell>
              <TableCell>
                {product.dex_rating ? (
                  <Tooltip title={`DEX Rating: ${product.dex_rating}/5`} arrow>
                    <span>{'★'.repeat(product.dex_rating)}{'☆'.repeat(5-product.dex_rating)}</span>
                  </Tooltip>
                ) : '-'}
              </TableCell>
              <TableCell>
                <Tooltip title="EU Wet Grip Rating" arrow>
                  <span style={{ 
                    color: product.wet_grip === 'A' ? 'green' : 
                           product.wet_grip === 'B' ? '#4CAF50' :
                           product.wet_grip === 'C' ? '#FFC107' :
                           product.wet_grip === 'D' ? '#FF9800' :
                           product.wet_grip === 'E' ? '#F44336' : 'inherit'
                  }}>
                    {product.wet_grip || '-'}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell>{product.fuel_efficiency || '-'}</TableCell>
              <TableCell>{product.noise_level ? `${product.noise_level} dB` : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TireDataVisualization; 