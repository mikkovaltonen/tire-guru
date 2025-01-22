import React, { useEffect, useMemo } from 'react';
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
  Typography,
  Chip
} from '@mui/material';
import { getNormalizedScores, calculateWeightedScore } from '../utils/scoreNormalizer';
import TireIcon from '@mui/icons-material/TireRepair';

// Add utility function for noise level parsing
const parseNoiseLevel = (noiseStr) => {
  if (!noiseStr) return null;
  
  noiseStr = noiseStr.toString().toLowerCase();
  let parsedValue;

  // Handle different formats
  if (noiseStr.includes('db')) {
    // Format: "72 dB" or "72dB"
    parsedValue = parseFloat(noiseStr.replace(/[^\d.]/g, ''));
  } else if (noiseStr.includes('/')) {
    // Format: "72/70 dB"
    parsedValue = parseFloat(noiseStr.split('/')[0]);
  } else {
    // Try direct parsing
    parsedValue = parseFloat(noiseStr);
  }

  // Validate the parsed value
  return (!isNaN(parsedValue) && parsedValue >= 50 && parsedValue <= 100) ? parsedValue : null;
};

function TireDataVisualization({ products, preferences }) {
  const [sortConfig, setSortConfig] = React.useState({
    key: 'attractivenessScore',
    direction: 'desc'
  });

  const sortedProducts = React.useMemo(() => {
    if (!products.length) return [];
    if (!preferences) return products;

    try {
      // Preprocess products to clean noise levels
      const cleanedProducts = products.map(product => ({
        ...product,
        noise_level: parseNoiseLevel(product.noise_level)
      }));

      // Calculate normalized scores and weighted scores for all products
      const productsWithScores = cleanedProducts.map(product => {
        const normalizedScores = getNormalizedScores(product, cleanedProducts);
        const attractivenessScore = calculateWeightedScore(normalizedScores, preferences);
        return {
          ...product,
          normalizedScores,
          attractivenessScore: Math.round(attractivenessScore * 100)
        };
      });

      return [...productsWithScores].sort((a, b) => 
        b.attractivenessScore - a.attractivenessScore
      );

    } catch (error) {
      console.error('Error calculating scores:', error);
      return products;
    }
  }, [products, preferences]);

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

  // Add data validation logging
  useEffect(() => {
    if (products.length > 0) {
      console.log('Product data validation:', {
        totalProducts: products.length,
        seasons: [...new Set(products.map(p => p.season))],
        brands: [...new Set(products.map(p => p.brand))],
        widths: [...new Set(products.map(p => p.width))],
        rimSizes: [...new Set(products.map(p => p.rim_size))]
      });

      // Check for potential data issues
      const dataIssues = products.filter(p => {
        return !p.season || !p.brand || !p.width || !p.rim_size;
      });

      if (dataIssues.length > 0) {
        console.warn('Products with missing data:', dataIssues);
      }
    }
  }, [products]);

  // Lasketaan kokonaismäärät
  const totals = useMemo(() => {
    const counts = products.reduce((acc, tire) => {
      if (tire.season === 'Wi') acc.winter++;
      if (tire.season === 'So') acc.summer++;
      acc.total++;
      return acc;
    }, { winter: 0, summer: 0, total: 0 });

    // Debug-loggaus
    console.log('Tire counts:', {
      total: counts.total,
      winter: counts.winter,
      summer: counts.summer,
      brands: [...new Set(products.map(p => p.brand))].length,
      sampleBrands: [...new Set(products.map(p => p.brand))].slice(0, 5)
    });

    return counts;
  }, [products]);

  // Lasketaan tilastot
  const stats = useMemo(() => {
    return {
      total: products.length,
      byBrand: products.reduce((acc, tire) => {
        const brand = tire.brand || 'Unknown';
        acc[brand] = (acc[brand] || 0) + 1;
        return acc;
      }, {}),
      bySeason: products.reduce((acc, tire) => {
        acc[tire.season] = (acc[tire.season] || 0) + 1;
        return acc;
      }, {})
    };
  }, [products]);

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Yhteenveto
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography>
            Yhteensä: {totals.total} rengasta
          </Typography>
          <Typography color="error">
            Talvirenkaat: {totals.winter} kpl
          </Typography>
          <Typography color="success.main">
            Kesärenkaat: {totals.summer} kpl
          </Typography>
        </Box>
      </Paper>

      {/* Ylälaidassa laskuri */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TireIcon color="primary" />
        <Typography variant="h6">
          Löytyi {stats.total} rengasta
        </Typography>
        
        {/* Kausijakaumat */}
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          {Object.entries(stats.bySeason).map(([season, count]) => (
            <Chip 
              key={season}
              label={`${season}: ${count} kpl`}
              color={season === 'Wi' ? 'error' : 'success'}
              variant="outlined"
            />
          ))}
        </Box>
      </Paper>

      {/* Merkkikohtaiset määrät */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Merkkijakauma:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(stats.byBrand).map(([brand, count]) => (
            <Chip 
              key={brand}
              label={`${brand}: ${count} kpl`}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Paper>

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
                <TableCell>
                  {product.noise_level ? 
                    `${product.noise_level} dB` : 
                    '-'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TireDataVisualization; 