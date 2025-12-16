export interface InspectedElement {
  id: string;
  timestamp: number;
  selector: string;
  tagName: string;
  className: string;
  properties: CSSProperties;
  position: ElementPosition;
}

export interface CSSProperties {
  typography: Typography;
  spacing: Spacing;
  dimensions: Dimensions;
  borders: Borders;
  layout?: Layout;
}

export interface Typography {
  fontFamily: string;
  fontSize: { value: number; unit: string };
  fontWeight: string | number;
  lineHeight: { value: number; unit: string };
  color: string;
  letterSpacing?: string;
  textTransform?: string;
}

export interface Spacing {
  padding: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  margin: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  gap?: string;
}

export interface Dimensions {
  width: { value: number; unit: string; computed: number };
  height: { value: number; unit: string; computed: number };
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
}

export interface Borders {
  borderRadius: {
    topLeft: string;
    topRight: string;
    bottomRight: string;
    bottomLeft: string;
  };
  border: {
    width: string;
    style: string;
    color: string;
  };
}

export interface Layout {
  display: string;
  position: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
}

export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}
